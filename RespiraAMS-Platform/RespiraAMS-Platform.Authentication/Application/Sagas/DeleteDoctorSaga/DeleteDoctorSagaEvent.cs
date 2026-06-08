using System;
using System.Collections.Generic;

namespace Application.Sagas.DeleteDoctorSaga
{
    public record StartDeleteDoctorSaga(Guid DoctorId);

    public record DeleteAuthDoctorCommand(Guid Id, Guid DoctorId);
    public record DeleteAuthDoctorCompleted(Guid Id);
    public record DeleteAuthDoctorFailed(Guid Id, string Message);

    public record DeleteDoctorCommand(Guid Id, Guid DoctorId);
    public record DeleteDoctorCompleted(
        Guid Id,
        string Address,
        ICollection<string> Degrees,
        string AcademicTitle,
        string CitizenIdentificationCard,
        DateTimeOffset? DateOfBirth,
        bool Gender,
        string Position,
        Guid? MediaId,
        string? MediaUrl
    );
    public record DeleteDoctorFailed(Guid Id, string Message);

    public record DeleteMediaCommand(Guid Id, Guid MediaId);
    public record DeleteMediaCompleted(Guid Id, string FileName, string BucketName);
    public record DeleteMediaFailed(Guid Id, string Message);

    public record CleanDeleteMediaCommand(string FileName, string BucketName);

    public record RollbackDeleteAuthDoctorCommand(
        Guid Id,
        Guid DoctorId,
        string FirstName,
        string LastName,
        string Role,
        string Email,
        string Password,
        string PhoneNumber
    );

    public record RollbackDeleteDoctorCommand(
        Guid Id,
        Guid DoctorId,
        string Address,
        ICollection<string> Degrees,
        string AcademicTitle,
        string CitizenIdentificationCard,
        DateTimeOffset? DateOfBirth,
        bool Gender,
        string Position,
        Guid? MediaId,
        string? MediaUrl
    );
}
