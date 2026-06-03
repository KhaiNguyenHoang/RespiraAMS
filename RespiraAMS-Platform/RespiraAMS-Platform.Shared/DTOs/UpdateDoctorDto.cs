using Microsoft.AspNetCore.Http;

namespace RespiraAMS_Platform.Shared.DTOs
{
    public record UpdateDoctorDto(
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber,
        string Address,
        ICollection<string> Degrees,
        string AcademicTitle,
        string CitizenIdentificationCard,
        DateTimeOffset? DateOfBirth,
        bool Gender,
        string Position,
        IFormFile? Avatar
    );
}
