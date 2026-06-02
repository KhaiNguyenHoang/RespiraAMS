using Domain.Enums;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSagaState
    {
        public required Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string PhoneNumber { get; set; }
        public RoleEnum Role { get; set; } = RoleEnum.Doctor;
        public required string Address { get; set; }
        public required ICollection<string> Degrees { get; set; }
        public required string AcademicTitle { get; set; }
        public required string CitizenIdentificationCard { get; set; }
        public DateTimeOffset? DateOfBirth { get; set; }
        public bool Gender { get; set; }
        public required string Position { get; set; }
        public Guid? MediaId { get; set; }
        public string? MediaUrl { get; set; }
        public byte[]? Avatar { get; set; } = [];

        //Tracing states of saga
        public bool IsAuthenticateCompleted { get; set; }
        public bool IsDoctorCompleted { get; set; }
        public bool IsMediaCompleted { get; set; }
        public bool IsDoctorMediaUpdated { get; set; }
    }
}
