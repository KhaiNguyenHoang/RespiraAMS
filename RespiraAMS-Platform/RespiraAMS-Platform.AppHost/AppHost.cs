#pragma warning disable ASPIREJAVASCRIPT001

var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");
var postgres = builder.AddPostgres("postgres").WithPgWeb().WithDataVolume();
var authDb = postgres.AddDatabase("authDb");
var doctorDb = postgres.AddDatabase("doctorDb");
var mediaDb = postgres.AddDatabase("mediaDb");
var appDb = postgres.AddDatabase("appDb");
var decisionDb = postgres.AddDatabase("decisionDb");
var rabbitmq = builder.AddRabbitMQ("rabbitmq");

var doctorApi = builder
    .AddProject<Projects.RespiraAMS_Platform_Doctor_API>("doctor-api")
    .WithReference(doctorDb)
    .WithReference(cache)
    .WithReference(rabbitmq)
    .WaitFor(doctorDb)
    .WaitFor(cache)
    .WaitFor(rabbitmq);

var mediaApi = builder
    .AddProject<Projects.RespiraAMS_Platform_Media_API>("media-api")
    .WithReference(mediaDb)
    .WithReference(cache)
    .WithReference(rabbitmq)
    .WaitFor(mediaDb)
    .WaitFor(cache)
    .WaitFor(rabbitmq);

var authenticationApi = builder
    .AddProject<Projects.RespiraAMS_Platform_Authentication_API>("authentication-api")
    .WithReference(authDb)
    .WithReference(cache)
    .WithReference(rabbitmq)
    .WithReference(doctorApi)
    .WaitFor(authDb)
    .WaitFor(cache)
    .WaitFor(rabbitmq)
    .WaitFor(doctorApi);

var appApi = builder
    .AddProject<Projects.RespiraAMS_Platform_App_API>("app-api")
    .WaitFor(appDb)
    .WithReference(appDb);

var decisionApi = builder
    .AddProject<Projects.RespiraAMS_Platform_TreatmentDecision_API>("decision-api")
    .WaitFor(decisionDb)
    .WithReference(decisionDb);

var gateway = builder
    .AddProject<Projects.RespiraAMS_Platform_Gateway>("gateway")
    .WithReference(authenticationApi)
    .WithReference(doctorApi)
    .WithReference(mediaApi)
    .WithReference(appApi)
    .WithExternalHttpEndpoints();

var frontend = builder
    .AddNextJsApp("frontend", "../frontend/", "dev")
    .WithReference(authenticationApi)
    .WithReference(doctorApi)
    .WithReference(mediaApi)
    .WithReference(gateway)
    .WithExternalHttpEndpoints();

appApi.WithReference(gateway).WaitFor(gateway);
decisionApi.WithReference(gateway).WaitFor(gateway);
authenticationApi.WithReference(gateway).WaitFor(gateway);
doctorApi.WithReference(gateway).WaitFor(gateway);
mediaApi.WithReference(gateway).WaitFor(gateway);
builder.Build().Run();