using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Abstracts.Authentication;
using Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Authentication
{
    public class JwtService : IJwtService
    {
        private readonly JwtSettings _jwtSettings;

        public JwtService(IOptions<JwtSettings> jwtSettings)
        {
            _jwtSettings = jwtSettings.Value;

            if (string.IsNullOrWhiteSpace(_jwtSettings.Secret))
                throw new InvalidOperationException("JWT Secret is not configured.");
        }

        public string GenerateAccessToken(AuthDoctor user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSettings.Secret);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Email, user.Email),
                new(ClaimTypes.Role, user.Role.ToString()),
                new(ClaimTypes.GivenName, user.FirstName),
                new(ClaimTypes.Surname, user.LastName),
                new(ClaimTypes.MobilePhone, user.PhoneNumber),
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(
                    _jwtSettings.AccessTokenExpiration > 0 ? _jwtSettings.AccessTokenExpiration : 15
                ),
                Issuer = _jwtSettings.Issuer,
                Audience = _jwtSettings.Audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public (string RefreshToken, DateTimeOffset ExpirationDate) GenerateRefreshToken()
        {
            var bytes = new byte[32];

            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(bytes);

            var refreshToken = Convert.ToBase64String(bytes);

            var expirationDate = DateTimeOffset.UtcNow.AddDays(
                _jwtSettings.RefreshTokenExpiration > 0 ? _jwtSettings.RefreshTokenExpiration : 30
            );

            return (refreshToken, expirationDate);
        }

        public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = false,
                ValidIssuer = _jwtSettings.Issuer,
                ValidAudience = _jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_jwtSettings.Secret)
                ),
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                var principal = tokenHandler.ValidateToken(
                    token,
                    tokenValidationParameters,
                    out var securityToken
                );

                if (securityToken is not JwtSecurityToken jwtToken)
                    return null;

                if (
                    !jwtToken.Header.Alg.Equals(
                        SecurityAlgorithms.HmacSha256,
                        StringComparison.OrdinalIgnoreCase
                    )
                )
                    return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }

        public string TokenHash(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return string.Empty;

            using var sha256 = SHA256.Create();

            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(token));

            return Convert.ToBase64String(hashBytes);
        }
    }
}
