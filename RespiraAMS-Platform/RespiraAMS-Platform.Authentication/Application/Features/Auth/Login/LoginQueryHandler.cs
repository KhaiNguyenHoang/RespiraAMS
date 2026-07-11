using Application.Abstracts.Authentication;
using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.DTOs;
using Application.Features.Tokens;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.Exceptions;
using Wolverine;

namespace Application.Features.Auth.Login
{
    public class LoginQueryHandler(
        IAuthDbContext dbContext,
        IJwtService jwtService,
        ICacheService cacheService,
        IMessageBus bus)
    {
        public async Task<UserDto?> Handle(LoginQuery query)
        {
            var emailKey = "user:email:" + query.Email;
            var user = await cacheService.GetAsync<AuthDoctor>(emailKey);

            if (user == null)
            {
                user = await dbContext.AuthDoctors
                    .FirstOrDefaultAsync(u => u.Email == query.Email && !u.IsDeleted);
                if (user != null)
                {
                    await cacheService.SetAsync(emailKey, user);
                    await cacheService.SetAsync("user:id:" + user.Id, user);
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
                throw new BadRequestException("Email address has not been verified. Please verify your email.");
            }

            var token = jwtService.GenerateAccessToken(user);
            var (refreshToken, expirationDate) = jwtService.GenerateRefreshToken();
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

            var tokenId = await bus.InvokeAsync<Guid>(
                new CreateTokenCommand
                {
                    HashedToken = jwtService.TokenHash(refreshToken),
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