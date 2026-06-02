using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Mapping;
using Application.Sagas.CreateDoctorSaga;
using FluentValidation;
using Infrastructure.Caching;
using Infrastructure.Mapping;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static void AddInfrastructureAndApplication(this IHostApplicationBuilder builder)
        {
            builder.AddNpgsqlDbContext<DoctorDbContext>("doctorDb");

            builder.Services.AddScoped<IDoctorDbContext>(provider =>
                provider.GetRequiredService<DoctorDbContext>()
            );

            builder.AddRedisClient("cache");

            builder.Services.AddFusionCache();
            builder.Services.AddSingleton<ICacheService, CacheService>();

            builder.Services.AddValidatorsFromAssemblyContaining<CreateDoctorSagaValidation>();

            builder.Services.AddMappingProfiles();
        }

        public static void ApplyMigrations(this IHost host)
        {
            using var scope = host.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DoctorDbContext>();
            try
            {
                context.Database.Migrate();
            }
            catch (Exception)
            {
                context.Database.EnsureDeleted();
                context.Database.Migrate();
            }
        }

        private static IServiceCollection AddMappingProfiles(this IServiceCollection services)
        {
            var mappingTypes = typeof(CreateDoctorCommandMapping)
                .Assembly.GetTypes()
                .Where(t =>
                    !t.IsAbstract
                    && !t.IsInterface
                    && t.GetInterfaces()
                        .Any(i =>
                            i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IMap<,>)
                        )
                );

            foreach (var type in mappingTypes)
            {
                foreach (
                    var @interface in type.GetInterfaces()
                        .Where(i =>
                            i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IMap<,>)
                        )
                )
                {
                    services.AddTransient(@interface, type);
                }
            }

            return services;
        }
    }
}
