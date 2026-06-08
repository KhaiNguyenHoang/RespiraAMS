using System;
using System.Collections.Generic;

namespace Application.Sagas.UpdateDoctorSaga
{
    public record StartUpdateDoctorSaga(
        Guid DoctorId,
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
        byte[]? Avatar
    );

    public record UpdateAuthDoctorCommand(
        Guid Id,
        Guid DoctorId,
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber
    );

    public record UpdateAuthDoctorCompleted(Guid Id, Guid DoctorId);
    public record UpdateAuthDoctorFailed(Guid Id, string Message);

    public record UpdateDoctorCommand(
        Guid Id,
        Guid DoctorId,
        string Address,
        ICollection<string> Degrees,
        string AcademicTitle,
        string CitizenIdentificationCard,
        DateTimeOffset? DateOfBirth,
        bool Gender,
        string Position
    );

    public record UpdateDoctorCompleted(
        Guid Id,
        string OldAddress,
        ICollection<string> OldDegrees,
        string OldAcademicTitle,
        string OldCitizenIdentificationCard,
        DateTimeOffset? OldDateOfBirth,
        bool OldGender,
        string OldPosition,
        Guid? OldMediaId,
        string? OldMediaUrl
    );

    public record UpdateDoctorFailed(Guid Id, string Message);

    public record UpdateMediaCommand(
        Guid Id,
        Guid DoctorId,
        byte[] Avatar
    );

    public record MediaUpdated(
        Guid Id,
        Guid MediaId,
        string MediaUrl
    );

    public record UpdateMediaFailed(Guid Id, string Message);

    public record UpdateDoctorMediaCommand(
        Guid Id,
        Guid DoctorId,
        Guid MediaId,
        string MediaUrl
    );

    public record UpdateDoctorMediaCompleted(Guid Id);
    public record UpdateDoctorMediaFailed(Guid Id, string Message);

    public record DeleteMediaCommand(Guid Id, Guid MediaId);

    public record RollbackAuthDoctorCommand(
        Guid Id,
        Guid DoctorId,
        string FirstName,
        string LastName,
        string Email,
        string PhoneNumber
    );

    public record RollbackDoctorCommand(
        Guid Id,
        Guid DoctorId,
        string Address,
        ICollection<string> Degrees,
        string AcademicTitle,
        string CitizenIdentificationCard,
        bool Gender,
        DateTimeOffset? DateOfBirth,
        string Position,
        Guid? MediaId,
        string? MediaUrl
    );

    public record RollbackMediaCommand(Guid Id, Guid MediaId);
}
