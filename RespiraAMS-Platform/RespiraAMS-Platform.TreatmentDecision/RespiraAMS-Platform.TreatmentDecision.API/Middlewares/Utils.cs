using RespiraAMS_Platform.Shared.DTOs;

namespace RespiraAMS_Platform.TreatmentDecision.API.Middlewares;

public static class Utils
{
    public static async Task WriteResult(HttpContext context, int status, string message)
    {
        context.Response.StatusCode = status;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(ApiResponse.Fail(message, status));
    }

    public static bool SetValueFromHeaderToContext(HttpContext context, string header)
    {
        if (context.Request.Headers.TryGetValue(header, out var value))
        {
            context.Items[header] = value;
            return true;
        }

        return false;
    }
}