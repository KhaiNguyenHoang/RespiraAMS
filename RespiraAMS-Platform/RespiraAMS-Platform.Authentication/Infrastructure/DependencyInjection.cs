using Application.Abstracts.Authentication;
using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Mapping;
using Application.Sagas.CreateDoctorSaga;
using FluentValidation;
using Infrastructure.Authentication;
using Infrastructure.Caching;
using Infrastructure.Mapping;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ZiggyCreatures.Caching.Fusion;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureAndApplication(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            var connectionString = configuration.GetConnectionString("database");
            services.AddDbContext<AuthDbContext>(options =>
                options.UseNpgsql(connectionString));

            services.AddScoped<IAuthDbContext>(provider =>
                provider.GetRequiredService<AuthDbContext>()
            );

            services.AddFusionCache();
            services.AddSingleton<ICacheService, CacheService>();

            services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
            services.AddScoped<IJwtService, JwtService>();

            services.AddValidatorsFromAssemblyContaining<CreateDoctorSagaValidation>();

            services.AddMappingProfiles();

            return services;
        }

        private static IServiceCollection AddMappingProfiles(this IServiceCollection services)
        {
            var mappingTypes = typeof(CreateAuthDoctorMapping)
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
