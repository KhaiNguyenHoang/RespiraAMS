using JasperFx.Core;
using RespiraAMS_Platform.Shared.DTOs;

namespace API.Middlewares;

public class AuthMiddleware(RequestDelegate next, ILogger<AuthMiddleware> logger)
{
    private static async Task WriteResult(HttpContext context, int status, string message)
    {
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(ApiResponse.Fail(message, status));
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var path = context.Request.Path.Value;
        if (path is null)
        {
            logger.LogWarning("Request path is null");
            await WriteResult(context, StatusCodes.Status404NotFound, "Resource not found");
            return;
        }

        // Since Scalar only exists in dev environment, it doesn't need auth
        if (!path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
        {
            await next(context);
            return;
        }

        // Get the headers provided by the gateway
        var role = context.Request.Headers["X-Role"].FirstOrDefault();
        if (role is null)
        {
            logger.LogWarning("No role set in request header");
            await WriteResult(context, StatusCodes.Status401Unauthorized, "Unauthorized access");
            return;
        }

        // Check for role if they are allow to access the endpoint
        // For manager, they are allow for all access, while doctor can only call to GET endpoints and
        // POST api/{version}/diagnose

        // role == doctor && (method == GET || (method == POST && path == "diagnose")) -> Doctor passed
        // role == manager -> auto passed
        // role == admin -> auto rejects?
        // role == ?? -> auto reject

        if (role.EqualsIgnoreCase("doctor"))
        {
            var method = context.Request.Method;
            
            if (!method.EqualsIgnoreCase("GET") &&
                (!method.EqualsIgnoreCase("POST") || !path.ContainsIgnoreCase("diagnose")))
            {
                await WriteResult(context, StatusCodes.Status403Forbidden, "Forbidden access");
                return;
            }
        }
        else if (role.EqualsIgnoreCase("manager"))
        {
            // This role should be allowed to call all endpoints in this service
        }
        else if (role.EqualsIgnoreCase("admin"))
        {
            // Admin is not allow to call on this?
            await WriteResult(context, StatusCodes.Status403Forbidden, "Forbidden access");
            return;
        }
        else
        {
            logger.LogWarning("Unknown role in request header: {role}", role);
            await WriteResult(context, StatusCodes.Status403Forbidden, "Forbidden access");
            return;
        }

        // Forward to the next layer
        await next(context);
    }
}