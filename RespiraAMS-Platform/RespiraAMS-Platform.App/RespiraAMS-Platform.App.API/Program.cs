using System.Text.Json;
using System.Text.Json.Serialization;
using Domain;
using Application;
using Infrastructure;
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
builder.Services.AddOpenApi();
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(
            namingPolicy: JsonNamingPolicy.CamelCase,
            allowIntegerValues: false));
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
app.ApplyMigrations(); 
await app.SeedData();

app.Run();