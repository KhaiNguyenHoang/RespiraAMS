using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.DTOs;

namespace RespiraAMS_Platform.Shared.Middlewares
{
    public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger = logger;

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken
        )
        {
            _logger.LogError(
                exception,
                "Error occurred while handling request {RequestMethod} {RequestPath}: {ExceptionMessage}",
                httpContext.Request.Method,
                httpContext.Request.Path,
                exception.Message
            );

            var (statusCode, message) = exception switch
            {
                ValidationException validationException => (
                    StatusCodes.Status400BadRequest,
                    string.Join("; ", validationException.Errors.Select(e => e.ErrorMessage))
                ),
                UnauthorizedAccessException => (
                    StatusCodes.Status401Unauthorized,
                    "You do not have permission to access this resource."
                ),
                KeyNotFoundException => (
                    StatusCodes.Status404NotFound,
                    "The requested resource was not found."
                ),
                _ => (
                    StatusCodes.Status500InternalServerError,
                    "An unexpected system error occurred. Please contact support."
                ),
            };

            httpContext.Response.StatusCode = statusCode;
            httpContext.Response.ContentType = "application/json";

            var errorResponse = ApiResponse<object>.Fail(message, statusCode);

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = false,
            };

            await httpContext.Response.WriteAsJsonAsync(
                errorResponse,
                jsonOptions,
                cancellationToken
            );

            return true;
        }
    }
}
