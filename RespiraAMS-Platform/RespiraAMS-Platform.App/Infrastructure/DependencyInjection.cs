using Application.Abstracts.Data;
using Infrastructure.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure;

public static class DependencyInjection
{
    public static void AddInfrastructure(this IHostApplicationBuilder builder)
    {
        builder.AddNpgsqlDbContext<AppDbContext>("appDb");
        builder.Services.AddScoped<IDbContext, AppDbContext>();
    }

    public static void ApplyMigrations(this IHost host, bool isDevEnv)
    {
        using var scope = host.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        try
        {
            context.Database.Migrate();
        }
        catch (Exception)
        {
            if (isDevEnv)
            {
                context.Database.EnsureDeleted();
            }
            context.Database.Migrate();
        }
    }
    
    public static async Task SeedData(this WebApplication app)
    {
        // Since this service didn't handle any sensitive/client-specific data, 
        // it's safe to seed data regardless environment
        using var scope = app.Services.CreateScope();
        var provider = scope.ServiceProvider;
        var context = provider.GetRequiredService<AppDbContext>();
        var logger = provider.GetRequiredService<ILogger<DbInitializer>>();
        await DbInitializer.InitializeAsync(context, logger);
    }
}