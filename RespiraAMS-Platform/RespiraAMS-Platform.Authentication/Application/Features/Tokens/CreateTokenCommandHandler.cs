using Application.Abstracts.Data;
using Domain.Entities;

namespace Application.Features.Tokens
{
    public class CreateTokenCommandHandler(IAuthDbContext dbContext)
    {
        private readonly IAuthDbContext _dbContext = dbContext;

        public async Task<Guid> Handle(
            CreateTokenCommand command,
            CancellationToken cancellationToken = default
        )
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

            await _dbContext.Tokens.AddAsync(token, cancellationToken);
            await _dbContext.SaveChangesAsync();

            return token.Id;
        }
    }
}
