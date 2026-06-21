using System.Text.Json;
using System.Text.Json.Serialization;
using Application;
using Asp.Versioning;
using Domain.Models;
using Infrastructure;
using Marten;
using RespiraAMS_Platform.Shared.Extensions;
using Scalar.AspNetCore;
using Serilog;
using Wolverine;
using Wolverine.FluentValidation;
using Wolverine.Marten;

var builder = WebApplication.CreateBuilder(args);

// Get connection string
var conn = builder.Configuration.GetConnectionString("decisionDb");
if (conn is null)
{
    throw new InvalidOperationException("No connection string found");
}
builder.Services
    .AddMarten(config =>
    {
        // Db connection
        config.Connection(conn);
        
        // Setup schemas
        config.Schema.For<Analytic>();
        config.Schema.For<Snapshot>();
    })
    .UseLightweightSessions()
    .IntegrateWithWolverine();
builder.AddCustomSerilog();
builder.Services.AddOpenApi();
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
builder.Services.AddFluentValidators();
builder.AddInfrastructure();
builder.Host.UseWolverine(opts =>
{
    opts.RestoreV5Defaults();
    opts.Discovery.IncludeAssembly(typeof(ApplicationMarker).Assembly);
    opts.UseFluentValidation(RegistrationBehavior.ExplicitRegistration);
    opts.Durability.Mode = DurabilityMode.Solo;
});
builder.Services.AddOpenTelemetry().WithTracing(tracing => tracing.AddSource("Wolverine"));
builder.Services.AddAuthorization();


var app = builder.Build();

app.UseCustomErrorHandling();
app.UseSerilogRequestLogging();

app.UseClaimsPropagation();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(opts =>
    {
        opts.Theme = ScalarTheme.Kepler;
    });
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();