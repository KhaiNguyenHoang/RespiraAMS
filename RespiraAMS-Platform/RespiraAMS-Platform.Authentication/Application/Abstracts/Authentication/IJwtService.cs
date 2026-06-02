using System.Security.Claims;
using Domain.Entities;

namespace Application.Abstracts.Authentication
{
    public interface IJwtService
    {
        string GenerateAccessToken(AuthDoctor user);

        string GenerateRefreshToken();

        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    }
}
