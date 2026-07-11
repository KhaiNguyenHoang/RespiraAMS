using Application.Sagas.CreateDoctorSaga;
using Application.Sagas.DeleteDoctorSaga;
using Application.Sagas.UpdateDoctorSaga;
using Asp.Versioning;
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
    opts.PublishMessage<Application.Sagas.CreateDoctorSaga.UpdateDoctorMediaCommand>()
        .ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<Application.Sagas.CreateDoctorSaga.RollbackDoctorCommand>()
        .ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<Application.Sagas.CreateDoctorSaga.RollbackMediaCommand>()
        .ToRabbitQueue("media-service-command");
    opts.PublishMessage<UpdateDoctorCommand>().ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<UpdateMediaCommand>().ToRabbitQueue("media-service-command");
    opts.PublishMessage<Application.Sagas.UpdateDoctorSaga.DeleteMediaCommand>()
        .ToRabbitQueue("media-service-command");
    opts.PublishMessage<Application.Sagas.UpdateDoctorSaga.RollbackDoctorCommand>()
        .ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<Application.Sagas.UpdateDoctorSaga.RollbackMediaCommand>()
        .ToRabbitQueue("media-service-command");
    opts.PublishMessage<Application.Sagas.UpdateDoctorSaga.UpdateDoctorMediaCommand>()
        .ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<DeleteDoctorCommand>().ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<RollbackDeleteDoctorCommand>().ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<Application.Sagas.DeleteDoctorSaga.DeleteMediaCommand>()
        .ToRabbitQueue("media-service-command");

    opts.Durability.Mode = DurabilityMode.Solo;
});

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
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
    app.MapScalarApiReference();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.MapControllers();
app.ApplyMigrations(app.Environment.IsDevelopment());
app.Run();
