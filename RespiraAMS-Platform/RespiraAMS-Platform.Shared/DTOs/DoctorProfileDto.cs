using System;
using System.Collections.Generic;

namespace RespiraAMS_Platform.Shared.DTOs
{
    public record DoctorProfileDto(
        Guid Id,
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
