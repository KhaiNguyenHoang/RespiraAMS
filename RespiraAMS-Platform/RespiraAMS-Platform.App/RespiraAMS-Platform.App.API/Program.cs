using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using API.Middlewares;
using Domain;
using Application;
using Asp.Versioning;
using Domain.Enums;
using Infrastructure;
using Microsoft.OpenApi;
using RespiraAMS_Platform.Shared.Extensions;
using Scalar.AspNetCore;
using Serilog;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;
using Wolverine.Postgresql;

var builder = WebApplication.CreateBuilder(args);

// Get connection string
var conn = builder.Configuration.GetConnectionString("appDb");
if (conn is null)
{
    throw new InvalidOperationException("No connection string found");
}


builder.AddCustomSerilog();
builder.Services.AddOpenApi(options =>
{
    options.AddSchemaTransformer((schema, context, _) =>
    {
        if (context.JsonTypeInfo.Type == typeof(Dictionary<RouteOfAdministration, List<string>>))
        {
            // Clear the generic "additionalProperties" fallback dictionary definition
            schema.AdditionalProperties = null;
            
            // Initialize the Properties dictionary if it is null
            schema.Properties = new Dictionary<string, IOpenApiSchema>();

            // 2. Loop through every available value in your Enum type
            foreach (var enumValue in Enum.GetNames<RouteOfAdministration>())
            {
                // 3. Explicitly construct the inner property schema (List of strings)
                schema.Properties[enumValue] = new OpenApiSchema
                {
                    Type = JsonSchemaType.Array,
                    Items = new OpenApiSchema
                    {
                        Type = JsonSchemaType.String
                    },
                    Description = $"Dosage values for {enumValue} administration"
                };
            }
        }
        
        // Targets your Enum types
        if (context.JsonTypeInfo.Type.IsEnum)
        {
            schema.Type = JsonSchemaType.String;
            schema.Enum = Enum.GetNames(context.JsonTypeInfo.Type)
                .Select(JsonNode (name) => JsonValue.Create(name))
                .ToList();
        }
        return Task.CompletedTask;
    });
});
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(
            namingPolicy: JsonNamingPolicy.CamelCase,
            allowIntegerValues: false));
    });
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});
builder.Services.AddCustomErrorHandling();
builder.AddServiceDefaults();
builder.Services.AddServices();
builder.Services.AddProfiles();
builder.Services.AddFluentValidators();
builder.AddInfrastructure();
builder.Host.UseWolverine(opts =>
{
    opts.RestoreV5Defaults();
    opts.Discovery.IncludeAssembly(typeof(ApplicationMarker).Assembly);

    opts.PersistMessagesWithPostgresql(conn, "appdb");
    opts.UseEntityFrameworkCoreTransactions();

    opts.UseFluentValidation(RegistrationBehavior.ExplicitRegistration);

    opts.Durability.Mode = DurabilityMode.Solo;
});
builder.Services.AddOpenTelemetry().WithTracing(tracing => tracing.AddSource("Wolverine"));

var app = builder.Build();

app.UseCustomErrorHandling();
app.UseSerilogRequestLogging();

app.UseClaimsPropagation();
// app.UseAuthorizationMiddleware(); // Remove comment to allow authorization

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(opts =>
    {
        opts.Theme = ScalarTheme.Kepler;
    });
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.MapControllers();
app.ApplyMigrations(app.Environment.IsDevelopment()); 
await app.SeedData();

app.Run();