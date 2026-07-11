using Application.Abstracts.Authentication;
using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Auth.VerifyEmail;

public class VerifyEmailCommandHandler(IAuthDbContext dbContext, ICacheService cacheService, IJwtService jwtService)
{
    public async Task HandleAsync(VerifyEmailCommand command)
    {
        var doctor = await dbContext.AuthDoctors
            .FirstOrDefaultAsync(u => u.Email == command.Email && !u.IsDeleted);

        if (doctor == null)
        {
            throw new BadRequestException("Account with this email was not found.");
        }

        if (doctor.IsEmailVerified)
        {
            return;
        }

        var hashedToken = jwtService.TokenHash(command.Token);
        var tokenRecord = await dbContext.Tokens.FirstOrDefaultAsync(t =>
            t.DoctorId == doctor.Id && t.HashedToken == hashedToken && t.TokenType == TokenType.EmailVerification);

        if (tokenRecord == null)
        {
            throw new BadRequestException("Invalid verification token");
        }

        if (tokenRecord.ExpirationDate < DateTime.UtcNow)
        {
            throw new BadRequestException("Verification token has expired.");
        }

        doctor.IsEmailVerified = true;
        dbContext.Tokens.Remove(tokenRecord);
        await dbContext.SaveChangesAsync();

        var guidKey = "user:id:" + doctor.Id;
        var emailKey = "user:email:" + doctor.Email;
        await cacheService.SetAsync(guidKey, doctor);
        await cacheService.SetAsync(emailKey, doctor);
    }
}