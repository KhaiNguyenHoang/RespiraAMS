#pragma warning disable ASPIREJAVASCRIPT001

using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");
var postgres = builder.AddPostgres("postgres").WithPgWeb().WithDataVolume();
var authDb = postgres.AddDatabase("authDb");
var doctorDb = postgres.AddDatabase("doctorDb");
var mediaDb = postgres.AddDatabase("mediaDb");
var clinicalDb = postgres.AddDatabase("clinicalDb");
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
    .AddProject<Projects.RespiraAMS_Platform_Clinical_API>("clinical-api")
    .WaitFor(clinicalDb)
    .WithReference(clinicalDb);

var decisionApi = builder
    .AddProject<Projects.RespiraAMS_Platform_Decision_API>("decision-api")
    .WaitFor(decisionDb)
    .WithReference(decisionDb);

var gateway = builder
    .AddProject<Projects.RespiraAMS_Platform_Gateway>("gateway")
    .WithReference(authenticationApi)
    .WithReference(doctorApi)
    .WithReference(mediaApi)
    .WithReference(appApi)
    .WithReference(decisionApi)
    .WithExternalHttpEndpoints();

var frontend = builder
    .AddNextJsApp("frontend", "../frontend/")
    .WithReference(authenticationApi)
    .WithReference(doctorApi)
    .WithReference(mediaApi)
    .WithReference(appApi)
    .WithReference(decisionApi)
    .WithReference(gateway)
    .WithEnvironment("GATEWAY_URL", gateway.GetEndpoint("https"));

if (builder.Environment.IsDevelopment())
{
    // Expose frontend port without proxy since Next.js run dev server use HMR (WebSocket internally), and 
    // Aspire didn't provide configuration on that. When running with production, HMR is disabled, then Aspire
    // will work
    frontend.WithEndpoint("http", e =>
    {
        e.IsProxied = false;
        e.TargetPort = 3000;
    });
}

appApi.WithReference(gateway).WaitFor(gateway);
decisionApi.WithReference(gateway).WaitFor(gateway);
authenticationApi.WithReference(gateway).WaitFor(gateway);
doctorApi.WithReference(gateway).WaitFor(gateway);
mediaApi.WithReference(gateway).WaitFor(gateway);
builder.Build().Run();