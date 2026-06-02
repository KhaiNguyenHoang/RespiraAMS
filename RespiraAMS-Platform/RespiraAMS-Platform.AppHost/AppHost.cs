var builder = DistributedApplication.CreateBuilder(args);

var cache = builder.AddRedis("cache");
var postgres = builder.AddPostgres("postgres").WithPgWeb().WithDataVolume();
var authDb = postgres.AddDatabase("authDb");
var doctorDb = postgres.AddDatabase("doctorDb");
var mediaDb = postgres.AddDatabase("mediaDb");
var rabbitmq = builder.AddRabbitMQ("rabbitmq");

builder.Build().Run();
