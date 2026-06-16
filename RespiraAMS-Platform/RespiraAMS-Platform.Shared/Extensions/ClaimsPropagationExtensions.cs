using Microsoft.AspNetCore.Builder;
using RespiraAMS_Platform.Shared.Middlewares;

namespace RespiraAMS_Platform.Shared.Extensions
{
    public static class ClaimsPropagationExtensions
    {
        public static IApplicationBuilder UseClaimsPropagation(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ClaimsPropagationMiddleware>();
        }
    }
}
