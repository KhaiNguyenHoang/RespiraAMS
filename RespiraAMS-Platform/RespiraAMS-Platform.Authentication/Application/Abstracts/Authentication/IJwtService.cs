using System.Security.Claims;
using Domain.Entities;

namespace Application.Abstracts.Authentication
{
    public interface IJwtService
    {
        string GenerateAccessToken(AuthDoctor user);

        (string RefreshToken, DateTimeOffset ExpirationDate) GenerateRefreshToken();

        ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);

        string TokenHash(string token);
    }
}
