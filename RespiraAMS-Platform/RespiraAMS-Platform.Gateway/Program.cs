using System;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

// Add Aspire service defaults
builder.AddServiceDefaults();

// Read JWT configuration
var secret = builder.Configuration["JwtSettings:Secret"] 
             ?? throw new InvalidOperationException("JWT Secret is not configured.");
var issuer = builder.Configuration["JwtSettings:Issuer"];
var audience = builder.Configuration["JwtSettings:Audience"];

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = issuer,
            ValidAudience = audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddServiceDiscovery();

// Configure YARP Reverse Proxy with claims transformation
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddServiceDiscoveryDestinationResolver()
    .AddTransforms(transformBuilderContext =>
    {
        transformBuilderContext.AddRequestTransform(transformContext =>
        {
            var user = transformContext.HttpContext.User;
            if (user.Identity?.IsAuthenticated == true)
            {
                var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                             ?? user.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
                var role = user.FindFirst(ClaimTypes.Role)?.Value;
                var email = user.FindFirst(ClaimTypes.Email)?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    transformContext.ProxyRequest.Headers.Remove("X-ID");
                    transformContext.ProxyRequest.Headers.TryAddWithoutValidation("X-ID", userId);
                }
                if (!string.IsNullOrEmpty(role))
                {
                    transformContext.ProxyRequest.Headers.Remove("X-Role");
                    transformContext.ProxyRequest.Headers.TryAddWithoutValidation("X-Role", role);
                }
                if (!string.IsNullOrEmpty(email))
                {
                    transformContext.ProxyRequest.Headers.Remove("X-Email");
                    transformContext.ProxyRequest.Headers.TryAddWithoutValidation("X-Email", email);
                }
            }
            return ValueTask.CompletedTask;
        });
    });

builder.Services.AddControllers();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapDefaultEndpoints();
app.MapControllers();
app.MapReverseProxy();

app.Run();
