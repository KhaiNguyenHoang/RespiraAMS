using Application.Sagas.CreateDoctorSaga;
using Application.Sagas.DeleteDoctorSaga;
using Application.Sagas.UpdateDoctorSaga;
using Infrastructure;
using RespiraAMS_Platform.Shared.Extensions;
using Scalar.AspNetCore;
using Serilog;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.FluentValidation;
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
    opts.UseFluentValidation(RegistrationBehavior.ExplicitRegistration);
    opts.Discovery.IncludeAssembly(typeof(CreateDoctorMediaSagaHandler).Assembly);

    var connectionString =
        builder.Configuration.GetConnectionString("mediaDb")
        ?? throw new InvalidOperationException("No connection string for mediaDb");

    opts.PersistMessagesWithPostgresql(connectionString, "mediadb");
    opts.UseEntityFrameworkCoreTransactions();
    opts.UseRabbitMqUsingNamedConnection("rabbitmq").AutoProvision();

    opts.ListenToRabbitQueue("media-service-command");

    opts.PublishMessage<MediaCreated>().ToRabbitQueue("auth-user-media");
    opts.PublishMessage<CreateMediaFailed>().ToRabbitQueue("auth-user-media");
    opts.PublishMessage<MediaUpdated>().ToRabbitQueue("auth-user-media");
    opts.PublishMessage<UpdateMediaFailed>().ToRabbitQueue("auth-user-media");
    opts.PublishMessage<DeleteMediaCompleted>().ToRabbitQueue("auth-user-media");
    opts.PublishMessage<DeleteMediaFailed>().ToRabbitQueue("auth-user-media");

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
