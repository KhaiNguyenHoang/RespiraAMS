using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Abstracts;
using Application.Abstracts.Data;
using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Auth
{
    public record ResendVerificationCommand(string Email);

    public class ResendVerificationCommandHandler(
        IAuthDbContext dbContext,
        IEmailService emailService,
        Application.Abstracts.Authentication.IJwtService jwtService
    )
    {
        private readonly IAuthDbContext _dbContext = dbContext;
        private readonly IEmailService _emailService = emailService;
        private readonly Application.Abstracts.Authentication.IJwtService _jwtService = jwtService;

        public async Task Handle(ResendVerificationCommand command)
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
                throw new ValidationException(
                    new List<ValidationFailure>
                    {
                        new("Email", "Account has already been verified.")
                    }
                );
            }

            var oldTokens = await _dbContext.Tokens
                .Where(t => t.DoctorId == doctor.Id && t.TokenType == TokenType.EmailVerification)
                .ToListAsync();

            if (oldTokens.Any())
            {
                _dbContext.Tokens.RemoveRange(oldTokens);
            }

            var tokenString = new Random().Next(100000, 999999).ToString();
            var hashedToken = _jwtService.TokenHash(tokenString);

            var verificationToken = new Token
            {
                HashedToken = hashedToken,
                DoctorId = doctor.Id,
                TokenType = TokenType.EmailVerification,
                ExpirationDate = DateTimeOffset.UtcNow.AddMinutes(15).UtcDateTime,
                IsRevoked = false,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            await _dbContext.Tokens.AddAsync(verificationToken);
            await _dbContext.SaveChangesAsync();

            var subject = "Welcome to RespiraAMS - Verify Your Email";
            var body = $"Welcome to RespiraAMS! Your verification code is: {tokenString}. It will expire in 15 minutes.";
            await _emailService.SendEmailAsync(doctor.Email, subject, body);
        }
    }
}
