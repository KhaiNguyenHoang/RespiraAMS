using Application.Abstracts.Data;
using Domain.Entities;

namespace Application.Features.Tokens
{
    public class CreateTokenCommandHandler(IAuthDbContext dbContext)
    {
        public async Task<Guid> HandleAsync(CreateTokenCommand command, CancellationToken cancellationToken = default)
        {
            var token = new Token
            {
                HashedToken = command.HashedToken,
                DoctorId = command.DoctorId,
                TokenType = command.TokenType,
                ExpirationDate = command.ExpirationDate.UtcDateTime,
                IsRevoked = false,
                CreatedAt = DateTimeOffset.UtcNow,
            };

            await dbContext.Tokens.AddAsync(token, cancellationToken);
            await dbContext.SaveChangesAsync();

            return token.Id;
        }
    }
}
