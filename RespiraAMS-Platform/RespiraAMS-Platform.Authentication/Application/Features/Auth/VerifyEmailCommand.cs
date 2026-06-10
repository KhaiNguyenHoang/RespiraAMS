using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Domain.Enums;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Auth
{
    public record VerifyEmailCommand(string Email, string Token);

    public class VerifyEmailCommandHandler(
        IAuthDbContext dbContext,
        ICacheService cacheService,
        Application.Abstracts.Authentication.IJwtService jwtService
    )
    {
        private readonly IAuthDbContext _dbContext = dbContext;
        private readonly ICacheService _cacheService = cacheService;
        private readonly Application.Abstracts.Authentication.IJwtService _jwtService = jwtService;

        public async Task Handle(VerifyEmailCommand command)
        {
            var doctor = await _dbContext.AuthDoctors.FirstOrDefaultAsync(u =>
                u.Email == command.Email && !u.IsDeleted
            );

            if (doctor == null)
            {
                throw new ValidationException(
                    new List<ValidationFailure>
                    {
                        new("Email", "Account with this email was not found.")
                    }
                );
            }

            if (doctor.IsEmailVerified)
            {
                return;
            }

            var hashedToken = _jwtService.TokenHash(command.Token);
            var tokenRecord = await _dbContext.Tokens.FirstOrDefaultAsync(t =>
                t.DoctorId == doctor.Id
                && t.HashedToken == hashedToken
                && t.TokenType == TokenType.EmailVerification
            );

            if (tokenRecord == null)
            {
                throw new ValidationException(
                    new List<ValidationFailure> { new("Token", "Invalid verification token.") }
                );
            }

            if (tokenRecord.ExpirationDate < DateTime.UtcNow)
            {
                throw new ValidationException(
                    new List<ValidationFailure> { new("Token", "Verification token has expired.") }
                );
            }

            doctor.IsEmailVerified = true;
            _dbContext.Tokens.Remove(tokenRecord);
            await _dbContext.SaveChangesAsync();

            var guidKey = "user:id:" + doctor.Id;
            var emailKey = "user:email:" + doctor.Email;
            await _cacheService.SetAsync(guidKey, doctor);
            await _cacheService.SetAsync(emailKey, doctor);
        }
    }
}
