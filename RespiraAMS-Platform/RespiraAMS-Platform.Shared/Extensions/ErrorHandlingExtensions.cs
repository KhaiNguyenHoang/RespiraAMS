using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using RespiraAMS_Platform.Shared.Middlewares;

namespace RespiraAMS_Platform.Shared.Extensions
{
    public static class ErrorHandlingExtensions
    {
        public static IServiceCollection AddCustomErrorHandling(this IServiceCollection services)
        {
            services.AddProblemDetails();
            services.AddExceptionHandler<GlobalExceptionHandler>();
            return services;
        }

        public static IApplicationBuilder UseCustomErrorHandling(this IApplicationBuilder app)
        {
            app.UseStatusCodePages(async context =>
            {
                var statusCode = context.HttpContext.Response.StatusCode;
                var message = statusCode switch
                {
                    401 => "You do not have permission to access this resource.",
                    403 => "Access to this resource is forbidden.",
                    404 => "The requested resource was not found.",
                    _ => "An unexpected system error occurred. Please contact support."
                };

                context.HttpContext.Response.ContentType = "application/json";
                var errorResponse = DTOs.ApiResponse<object>.Fail(message, statusCode);
                await context.HttpContext.Response.WriteAsJsonAsync(errorResponse);
            });

            app.UseExceptionHandler();
            return app;
        }
    }
}
