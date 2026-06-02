using Application.Sagas.CreateDoctorSaga;
using Scalar.AspNetCore;
using Wolverine;
using Wolverine.EntityFrameworkCore;
using Wolverine.Postgresql;
using Wolverine.RabbitMQ;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Host.UseWolverine(opts =>
{
    opts.RestoreV5Defaults();
    opts.Discovery.IncludeAssembly(typeof(CreateDoctorSagaHandler).Assembly);

    var connectionString =
        builder.Configuration.GetConnectionString("authDb")
        ?? throw new InvalidOperationException("No connection string for authDb");

    opts.PersistMessagesWithPostgresql(connectionString, "authDb");
    opts.UseEntityFrameworkCoreTransactions();
    opts.UseRabbitMqUsingNamedConnection("rabbitmq").AutoProvision();

    opts.ListenToRabbitQueue("auth-user-media");

    opts.PublishMessage<CreateMediaCommand>().ToRabbitQueue("media-service-command");
    opts.PublishMessage<CreateDoctorCommand>().ToRabbitQueue("doctor-service-command");
    opts.PublishMessage<UpdateDoctorMediaCommand>().ToRabbitQueue("doctor-service-command");
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();
app.MapControllers();
app.Run();
