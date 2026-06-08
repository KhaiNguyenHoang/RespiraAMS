using Domain.Enums;
using RespiraAMS_Platform.Shared.Entities;

namespace Domain.Entities
{
    public class AuthDoctor : BaseEntity
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public RoleEnum Role { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string PhoneNumber { get; set; }
        public bool IsEmailVerified { get; set; } = false;
    }
}
