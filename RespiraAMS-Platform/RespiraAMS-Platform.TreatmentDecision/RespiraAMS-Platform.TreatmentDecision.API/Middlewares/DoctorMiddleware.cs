using JasperFx.Core;

namespace RespiraAMS_Platform.TreatmentDecision.API.Middlewares;

[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class)]
public class RequireDoctorMiddlewareAttribute : Attribute { }

public class DoctorMiddleware(RequestDelegate next, ILogger<DoctorMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        var hasAttribute = endpoint?.Metadata.GetMetadata<RequireDoctorMiddlewareAttribute>() is not null;

        if (!hasAttribute)
        {
            await next(context);
            return;
        }

        var path = context.Request.Path.Value;
        if (path is null)
        {
            logger.LogWarning("Request path is null");
            await Utils.WriteResult(context, StatusCodes.Status404NotFound, "Resource not found");
            return;
        }

        // Since Scalar only exists in dev environment, it doesn't need auth
        if (!path.StartsWith("/api", StringComparison.OrdinalIgnoreCase))
        {
            await next(context);
            return;
        }
        
        // Get role
        var role = context.Request.Headers["X-Role"].FirstOrDefault();
        if (role is null)
        {
            logger.LogWarning("No role set in request header");
            await Utils.WriteResult(context, StatusCodes.Status401Unauthorized, "Unauthorized access");
            return;
        }

        if (!role.EqualsIgnoreCase("doctor"))
        {
            await Utils.WriteResult(context, StatusCodes.Status403Forbidden, "Forbidden access");
            return;
        }
        
        // Put the ID and Name into context
        if (!Utils.SetValueFromHeaderToContext(context, "X-ID"))
        {
            logger.LogWarning("Invalid request header: missing X-ID");
            await Utils.WriteResult(context, StatusCodes.Status401Unauthorized, "Unauthorized access");
            return;
        }

        if (!Utils.SetValueFromHeaderToContext(context, "X-Name"))
        {
            logger.LogWarning("Invalid request header: missing X-Name");
            await Utils.WriteResult(context, StatusCodes.Status401Unauthorized, "Unauthorized access");
            return;
        }

        await next(context);
    }
}