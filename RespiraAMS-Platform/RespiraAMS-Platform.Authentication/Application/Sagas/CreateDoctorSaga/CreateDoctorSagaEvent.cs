using Domain.Enums;

namespace Application.Sagas.CreateDoctorSaga
{
    public record StartCreateDoctorSaga(
        Guid Id,
        string FirstName,
        string LastName,
        string Email,
        string Password,
        string PhoneNumber,
        RoleEnum Role,
        string Address,
        ICollection<string> Degrees,
        string AcademicTitle,
        string CitizenIdentificationCard,
        DateTimeOffset? DateOfBirth,
        bool Gender,
        string Position,
        byte[]? Avatar
    );

    public record CreateAuthDoctorCommand(
        Guid Id,
        string FirstName,
        string LastName,
        RoleEnum Role,
        string Email,
        string Password,
        string PhoneNumber
    );

    public record CreateAuthDoctorCompleted(Guid Id);

    public record CreateAuthDoctorFailed(Guid Id, string Message);

    public record RollbackAuthDoctorCommand(Guid Id);

    public record CreateDoctorCommand(
        Guid Id,
        string Address,
        ICollection<string> Degrees,
        string AcademicTitle,
        string CitizenIdentificationCard,
        DateTimeOffset? DateOfBirth,
        bool Gender,
        string Position
    );

    public record CreateDoctorCompleted(Guid Id);

    public record CreateDoctorFailed(Guid Id, string Message);

    public record RollbackDoctorCommand(Guid Id);

    public record CreateMediaCommand(Guid Id, byte[]? Avatar);

    public record CreateMediaCompleted(Guid Id, Guid MediaId, string MediaUrl);

    public record MediaCreated(Guid Id, Guid MediaId, string MediaUrl);

    public record CreateMediaFailed(Guid Id, string Message);

    public record RollbackMediaCommand(Guid Id);

    public record UpdateDoctorMediaCommand(Guid Id, Guid MediaId, string MediaUrl);

    public record UpdateDoctorMediaCompleted(Guid Id);

    public record UpdateDoctorMediaFailed(Guid Id, string Message);
}
