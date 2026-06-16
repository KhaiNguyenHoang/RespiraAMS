using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace RespiraAMS_Platform.Shared.Middlewares
{
    public class ClaimsPropagationMiddleware(RequestDelegate next)
    {
        private readonly RequestDelegate _next = next;

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.Request.Headers.TryGetValue("X-ID", out var userIdValues))
            {
                var userId = userIdValues.ToString();
                if (!string.IsNullOrEmpty(userId))
                {
                    var claims = new List<Claim>
                    {
                        new(ClaimTypes.NameIdentifier, userId),
                        new("sub", userId),
                    };

                    if (context.Request.Headers.TryGetValue("X-Role", out var roleValues))
                    {
                        var roles = roleValues
                            .ToString()
                            .Split(',', StringSplitOptions.RemoveEmptyEntries);
                        foreach (var role in roles)
                        {
                            claims.Add(new Claim(ClaimTypes.Role, role.Trim()));
                        }
                    }

                    if (context.Request.Headers.TryGetValue("X-Email", out var emailValues))
                    {
                        claims.Add(new Claim(ClaimTypes.Email, emailValues.ToString()));
                    }

                    var identity = new ClaimsIdentity(claims, "GatewayAuth");
                    context.User = new ClaimsPrincipal(identity);
                }
            }

            await _next(context);
        }
    }
}
