namespace RespiraAMS_Platform.TreatmentDecision.API.Middlewares;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseDoctorMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<DoctorMiddleware>();
    }

    public static IApplicationBuilder UseAuthMiddleware(this IApplicationBuilder app)
    {
        return app.UseMiddleware<AuthMiddleware>();
    }

}