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
  opts.Discovery.IncludeAssembly(typeof(CreateDoctorSagaHandler).Assembly);

  var connectionString =
      builder.Configuration.GetConnectionString("doctorDb")
      ?? throw new InvalidOperationException("No connection string for doctorDb");

  opts.PersistMessagesWithPostgresql(connectionString, "doctordb");
  opts.UseEntityFrameworkCoreTransactions();
  opts.UseRabbitMqUsingNamedConnection("rabbitmq").AutoProvision();

  opts.ListenToRabbitQueue("doctor-service-command");

  opts.PublishMessage<CreateDoctorCompleted>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<CreateDoctorFailed>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<Application.Sagas.CreateDoctorSaga.UpdateDoctorMediaCompleted>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<Application.Sagas.CreateDoctorSaga.UpdateDoctorMediaFailed>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<UpdateDoctorCompleted>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<UpdateDoctorFailed>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<Application.Sagas.UpdateDoctorSaga.UpdateDoctorMediaCompleted>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<Application.Sagas.UpdateDoctorSaga.UpdateDoctorMediaFailed>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<DeleteDoctorCompleted>().ToRabbitQueue("auth-user-media");
  opts.PublishMessage<DeleteDoctorFailed>().ToRabbitQueue("auth-user-media");

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
  app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();
app.ApplyMigrations();
app.Run();
