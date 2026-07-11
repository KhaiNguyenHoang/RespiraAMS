using Application.Abstracts;
using Application.Abstracts.Data;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Auth.ResendVerificationEmail;

public class ResendVerificationEmailCommandHandler(
    IAuthDbContext dbContext,
    IEmailService emailService,
    Abstracts.Authentication.IJwtService jwtService)
{
    public async Task HandleAsync(ResendVerificationEmailCommand command)
    {
        var doctor = await dbContext.AuthDoctors
            .FirstOrDefaultAsync(u => u.Email == command.Email && !u.IsDeleted);

        if (doctor == null)
        {
            throw new BadRequestException("Account with this email was not found.");
        }

        if (doctor.IsEmailVerified)
        {
            throw new BadRequestException("Email is already verified.");
        }

        var oldTokens = await dbContext.Tokens
            .Where(t => t.DoctorId == doctor.Id && t.TokenType == TokenType.EmailVerification)
            .ToListAsync();

        if (oldTokens.Count != 0)
        {
            dbContext.Tokens.RemoveRange(oldTokens);
        }

        var tokenString = new Random().Next(100000, 999999).ToString();
        var hashedToken = jwtService.TokenHash(tokenString);

        var verificationToken = new Token
        {
            HashedToken = hashedToken,
            DoctorId = doctor.Id,
            TokenType = TokenType.EmailVerification,
            ExpirationDate = DateTimeOffset.UtcNow.AddMinutes(15).UtcDateTime,
            IsRevoked = false,
            CreatedAt = DateTimeOffset.UtcNow,
        };

        await dbContext.Tokens.AddAsync(verificationToken);
        await dbContext.SaveChangesAsync();

        var subject = "Welcome to RespiraAMS - Verify Your Email";
        var body =
            $"Welcome to RespiraAMS! Your verification code is: {tokenString}. It will expire in 15 minutes.";
        await emailService.SendEmailAsync(doctor.Email, subject, body);
    }
}