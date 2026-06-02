using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Entities
{
    public class BlacklistToken : BaseEntity
    {
        public required string HashedToken { get; set; }
        public required Guid DoctorId { get; set; }
        public AuthDoctor? Doctor { get; set; }
        public required string TokenType { get; set; }
        public required DateTimeOffset ExpirationDate { get; set; } = DateTimeOffset.UtcNow;
    }
}
