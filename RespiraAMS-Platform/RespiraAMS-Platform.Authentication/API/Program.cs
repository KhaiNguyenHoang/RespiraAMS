using Application.Sagas.CreateDoctorSaga;
using Infrastructure;
using RespiraAMS_Platform.Shared.Extensions;
using Scalar.AspNetCore;
using Serilog;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Postgresql;
using Wolverine.RabbitMQ;

var builder = WebApplication.CreateBuilder(args);

builder.AddCustomSerilog();

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddCustomErrorHandling();
builder.AddServiceDefaults();
builder.AddInfrastructureAndApplication();

builder.Host.UseWolverine(opts =>
{
    opts.RestoreV5Defaults();
    opts.Discovery.IncludeAssembly(typeof(CreateDoctorSagaHandler).Assembly);

    var connectionString =
        builder.Configuration.GetConnectionString("authDb")
        ?? throw new InvalidOperationException("No connection string for authDb");

    opts.PersistMessagesWithPostgresql(connectionString, "authdb");
    opts.UseEntityFrameworkCoreTransactions();
    opts.UseRabbitMqUsingNamedConnection("rabbitmq").AutoProvision();

    opts.ListenToRabbitQueue("auth-user-media");

    opts.PublishMessage<CreateMediaCommand>().ToRabbitQueue("media-service-command");
    opts.PublishMessage<CreateDoctorCommand>().ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<UpdateDoctorMediaCommand>().ToRabbitQueue("doctor-service-command");

    opts.Durability.Mode = DurabilityMode.Solo;
});

builder.Services.AddOpenTelemetry().WithTracing(tracing => tracing.AddSource("Wolverine"));

var app = builder.Build();

app.UseCustomErrorHandling();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();
app.ApplyMigrations();
app.Run();
