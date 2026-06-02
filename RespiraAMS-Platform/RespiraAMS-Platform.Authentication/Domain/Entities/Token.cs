using Domain.Enums;
using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Entities
{
    public class Token : BaseEntity
    {
        public required string HashedToken { get; set; }
        public Guid DoctorId { get; set; }
        public AuthDoctor? Doctor { get; set; }
        public TokenType TokenType { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool IsRevoked { get; set; } = false;
    }
}
