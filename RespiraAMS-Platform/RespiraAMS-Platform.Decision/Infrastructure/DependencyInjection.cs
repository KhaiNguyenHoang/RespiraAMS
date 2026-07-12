using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Infrastructure.Data;
using Infrastructure.Utils.Mapping;
using JasperFx;
using Marten;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Wolverine.Marten;

namespace Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructure(this IHostApplicationBuilder builder)
    {
        builder.Services.AddScoped<IDbContext, AppDbContext>();
        builder.Services.AddScoped<IPaginationFactory, PaginationFactory>();
    }

    public static IHostApplicationBuilder AddDatabase(this IHostApplicationBuilder builder, string conn)
    {
        builder.Services
            .AddMarten(config =>
            {
                // Db connection
                config.Connection(conn);

                // Explicitly register document types so Marten maps them right away
                config.RegisterDocumentType<Snapshot>();
                config.RegisterDocumentType<Analytic>();
                
                // Setup schemas
                config.Schema.For<Snapshot>();
                config.Schema.For<Analytic>()
                    .Index(x => x.DoctorId)
                    .Index(x => x.Month)
                    .Index(x => x.Year);

                // Auto create schema on start up (should only for dev environment)
                if (builder.Environment.IsDevelopment())
                {
                    config.AutoCreateSchemaObjects = AutoCreate.CreateOrUpdate;
                }
            })
            .ApplyAllDatabaseChangesOnStartup()
            .UseLightweightSessions()
            .IntegrateWithWolverine();
        return builder;
    }
}