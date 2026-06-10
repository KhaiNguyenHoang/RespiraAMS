namespace RespiraAMS_Platform.Shared.DTOs
{
    public record DoctorResponseDto(
        Guid Id,
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber,
        string Role,
        DateTimeOffset CreatedAt,
        string Address,
        ICollection<string> Degrees,
        string? AcademicTitle,
        string CitizenIdentificationCard,
        bool Gender,
        DateTimeOffset? DateOfBirth,
        string Position,
        Guid? MediaId,
        string? MediaUrl
    );
}
