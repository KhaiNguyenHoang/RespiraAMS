namespace Application.Sagas.CreateDoctorSaga
{
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

    public record UpdateDoctorMediaCommand(Guid Id, Guid MediaId, string MediaUrl);

    public record UpdateDoctorMediaCompleted(Guid Id);

    public record UpdateDoctorMediaFailed(Guid Id, string Message);
}
