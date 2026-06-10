using Microsoft.AspNetCore.Builder;
using Serilog;
using Serilog.Events;

namespace RespiraAMS_Platform.Shared.Extensions
{
    public static class LoggingExtensions
    {
        public static void AddCustomSerilog(this WebApplicationBuilder builder)
        {
            var logPath = Path.Combine(Directory.GetCurrentDirectory(), "Logs", "log-.txt");

            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
                .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [{SourceContext}] {Message:lj}{NewLine}{Exception}")
                .WriteTo.File(
                    logPath,
                    rollingInterval: RollingInterval.Day,
                    outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] [{SourceContext}] {Message:lj}{NewLine}{Exception}"
                )
                .CreateLogger();

            builder.Host.UseSerilog();
        }
    }
}
