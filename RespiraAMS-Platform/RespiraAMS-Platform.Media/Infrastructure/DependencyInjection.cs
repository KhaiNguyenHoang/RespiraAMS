using Amazon.S3;
using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Storage;
using Application.Sagas.CreateDoctorSaga;
using FluentValidation;
using Infrastructure.Caching;
using Infrastructure.Persistence;
using Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static void AddInfrastructureAndApplication(this IHostApplicationBuilder builder)
        {
            builder.AddNpgsqlDbContext<MediaDbContext>("mediaDb");

            builder.Services.AddScoped<IMediaDbContext, MediaDbContext>();

            builder.AddRedisClient("cache");

            builder.Services.AddFusionCache();
            builder.Services.AddSingleton<ICacheService, CacheService>();

            var r2Config = builder.Configuration.GetSection("R2");
            var accountId = r2Config["AccountId"];
            var accessKeyId = r2Config["AccessKeyId"];
            var secretAccessKey = r2Config["SecretAccessKey"];

            builder.Services.AddSingleton<IAmazonS3>(sp =>
            {
                var s3Config = new AmazonS3Config();

                if (!string.IsNullOrEmpty(accountId))
                {
                    s3Config.ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com";
                }
                else
                {
                    s3Config.ServiceURL = r2Config["ServiceURL"] ?? "http://localhost:4566";
                }

                s3Config.ForcePathStyle = true;

                if (!string.IsNullOrEmpty(accessKeyId) && !string.IsNullOrEmpty(secretAccessKey))
                {
                    return new AmazonS3Client(accessKeyId, secretAccessKey, s3Config);
                }

                return new AmazonS3Client("development-key", "development-secret", s3Config);
            });

            builder.Services.AddSingleton<IStorageService, R2StorageService>();

            builder.Services.AddValidatorsFromAssemblyContaining<CreateDoctorMediaSagaValidation>(
                ServiceLifetime.Transient
            );
        }

        public static void ApplyMigrations(this IHost host, bool isDevEnv)
        {
            using var scope = host.Services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<MediaDbContext>();
            try
            {
                context.Database.Migrate();
            }
            catch (Exception)
            {
                if (isDevEnv) context.Database.EnsureDeleted();
                context.Database.Migrate();
            }
        }
    }
}
