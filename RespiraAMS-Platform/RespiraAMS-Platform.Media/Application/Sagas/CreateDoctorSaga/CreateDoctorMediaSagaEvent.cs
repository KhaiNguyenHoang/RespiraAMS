namespace Application.Sagas.CreateDoctorSaga
{
    public record CreateMediaCommand(Guid Id, byte[]? Avatar);

    public record MediaCreated(Guid Id, Guid MediaId, string MediaUrl);

    public record CreateMediaFailed(Guid Id, string Message);

    public record RollbackMediaCommand(Guid Id);
}
