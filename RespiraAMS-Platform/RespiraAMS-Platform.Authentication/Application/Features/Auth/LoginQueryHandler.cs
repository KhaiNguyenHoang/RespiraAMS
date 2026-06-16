using Application.Abstracts.Authentication;
using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.DTOs;
using Application.Features.Tokens;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Wolverine;

namespace Application.Features.Auth
{
    public class LoginQueryHandler(
        IAuthDbContext dbContext,
        IJwtService jwtService,
        ICacheService cacheService,
        IMessageBus bus
    )
    {
        private readonly IAuthDbContext _dbContext = dbContext;
        private readonly IJwtService _jwtService = jwtService;
        private readonly ICacheService _cacheService = cacheService;
        private readonly IMessageBus _bus = bus;

        public async Task<UserDto?> Handle(LoginQuery query)
        {
            var emailKey = "user:email:" + query.Email;
            var user = await _cacheService.GetAsync<AuthDoctor>(emailKey);

            if (user == null)
            {
                user = await _dbContext.AuthDoctors.FirstOrDefaultAsync(u =>
                    u.Email == query.Email && !u.IsDeleted
                );
                if (user != null)
                {
                    await _cacheService.SetAsync(emailKey, user);
                    await _cacheService.SetAsync("user:id:" + user.Id, user);
                }
            }

            if (user?.IsDeleted != false)
            {
                return null;
            }

            var isPasswordCorrect = BCrypt.Net.BCrypt.Verify(query.Password, user.Password);

            if (!isPasswordCorrect)
            {
                return null;
            }

            if (!user.IsEmailVerified)
            {
                throw new FluentValidation.ValidationException([
                    new FluentValidation.Results.ValidationFailure(
                        "Email",
                        "Email address has not been verified. Please verify your email."
                    ),
                ]);
            }

            var token = _jwtService.GenerateAccessToken(user);
            var (refreshToken, expirationDate) = _jwtService.GenerateRefreshToken();
            var userDto = new UserDto(
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.Role.ToString(),
                token,
                refreshToken
            );

            var tokenId = await _bus.InvokeAsync<Guid>(
                new CreateTokenCommand
                {
                    HashedToken = _jwtService.TokenHash(refreshToken),
                    DoctorId = user.Id,
                    TokenType = TokenType.RefreshToken,
                    ExpirationDate = expirationDate,
                }
            );

            if (tokenId == Guid.Empty)
            {
                return null;
            }

            return userDto;
        }
    }
}
