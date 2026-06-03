using Domain.Enums;

namespace Application.Features.Tokens
{
    public class CreateTokenCommand
    {
        public required string HashedToken { get; set; }
        public Guid DoctorId { get; set; }
        public TokenType TokenType { get; set; }
        public DateTimeOffset ExpirationDate { get; set; }
    }
}
