using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Domain.Enums;
using FluentValidation;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace Application.Sagas.UpdateDoctorSaga
{
    public class UpdateDoctorSagaHandler(
        IDoctorDbContext dbContext,
        ICacheService cacheService,
        IValidator<UpdateDoctorCommand> validator,
        ILogger<UpdateDoctorSagaHandler> logger
    )
    {
        private List<DegreeEnum> ParseDegrees(ICollection<string> degrees)
        {
            var degreeStrings = new List<string>();
            foreach (var d in degrees)
            {
                if (string.IsNullOrWhiteSpace(d))
                    continue;

                var trimmed = d.Trim();
                if (trimmed.StartsWith('[') && trimmed.EndsWith(']'))
                {
                    try
                    {
                        var parsed = JsonSerializer.Deserialize<List<string>>(trimmed);
                        if (parsed != null)
                        {
                            degreeStrings.AddRange(parsed);
                        }
                    }
                    catch
                    {
                        degreeStrings.Add(trimmed);
                    }
                }
                else
                {
                    degreeStrings.Add(trimmed);
                }
            }
            return degreeStrings.Select(d => Enum.Parse<DegreeEnum>(d.Trim(), true)).ToList();
        }

        public async Task<object> Handle(UpdateDoctorCommand command)
        {
            try
            {
                var validationResult = await validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {
                    var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                    logger.LogWarning("UpdateDoctorCommand validation failed for Doctor ID {DoctorId}: {Errors}", command.DoctorId, errors);
                    return new UpdateDoctorFailed(command.Id, errors);
                }

                var doctor = await dbContext.Doctors.FindAsync(command.DoctorId);
                if (doctor == null)
                {
                    logger.LogWarning("UpdateDoctorCommand failed: Doctor with ID {DoctorId} not found.", command.DoctorId);
                    return new UpdateDoctorFailed(command.Id, "Doctor profile not found.");
                }

                // Backup old Profile values
                var oldAddress = doctor.Address;
                var oldDegrees = doctor.Degrees;
                var oldAcademicTitle = doctor.AcademicTitle;
                var oldCitizenCard = doctor.CitizenIdentificationCard;
                var oldGender = doctor.Gender;
                var oldDob = doctor.DateOfBirth;
                var oldPosition = doctor.Position;
                var oldMediaId = doctor.MediaId;
                var oldMediaUrl = doctor.MediaUrl;

                // Update properties
                doctor.Address = command.Address;
                doctor.Degrees = ParseDegrees(command.Degrees);
                doctor.AcademicTitle = string.IsNullOrWhiteSpace(command.AcademicTitle) || command.AcademicTitle.Equals("None", StringComparison.OrdinalIgnoreCase)
                    ? null
                    : Enum.Parse<AcademicTitleEnum>(command.AcademicTitle.Trim(), true);
                doctor.CitizenIdentificationCard = command.CitizenIdentificationCard;
                doctor.DateOfBirth = command.DateOfBirth;
                doctor.Gender = command.Gender;
                doctor.Position = Enum.Parse<PositionEnum>(command.Position.Trim(), true);
                doctor.UpdatedAt = DateTimeOffset.UtcNow;

                await dbContext.SaveChangesAsync();

                // Update cache
                await cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);

                logger.LogInformation("Doctor profile updated successfully for Doctor ID {DoctorId}", command.DoctorId);

                return new UpdateDoctorCompleted(
                    command.Id,
                    oldAddress,
                    [.. oldDegrees.Select(d => d.ToString())],
                    oldAcademicTitle?.ToString() ?? "None",
                    oldCitizenCard,
                    oldDob,
                    oldGender,
                    oldPosition.ToString(),
                    oldMediaId,
                    oldMediaUrl
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "UpdateDoctorCommand failed for Doctor ID {DoctorId}", command.DoctorId);
                return new UpdateDoctorFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(RollbackDoctorCommand command)
        {
            try
            {
                var doctor = await dbContext.Doctors.FindAsync(command.DoctorId);
                if (doctor != null)
                {
                    doctor.Address = command.Address;
                    doctor.Degrees = ParseDegrees(command.Degrees);
                    doctor.AcademicTitle = string.IsNullOrWhiteSpace(command.AcademicTitle) || command.AcademicTitle.Equals("None", StringComparison.OrdinalIgnoreCase)
                        ? null
                        : Enum.Parse<AcademicTitleEnum>(command.AcademicTitle.Trim(), true);
                    doctor.CitizenIdentificationCard = command.CitizenIdentificationCard;
                    doctor.Gender = command.Gender;
                    doctor.DateOfBirth = command.DateOfBirth;
                    doctor.Position = Enum.Parse<PositionEnum>(command.Position.Trim(), true);
                    doctor.MediaId = command.MediaId;
                    doctor.MediaUrl = command.MediaUrl;
                    doctor.UpdatedAt = DateTimeOffset.UtcNow;

                    await dbContext.SaveChangesAsync();

                    await cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);
                    logger.LogInformation("Doctor profile rolled back successfully for Doctor ID {DoctorId}", command.DoctorId);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "RollbackDoctorCommand failed for Doctor ID {DoctorId}", command.DoctorId);
            }
        }

        public async Task<object> Handle(UpdateDoctorMediaCommand command)
        {
            try
            {
                var doctor = await dbContext.Doctors.FindAsync(command.DoctorId);
                if (doctor == null)
                {
                    logger.LogWarning("UpdateDoctorMediaCommand failed: Doctor with ID {DoctorId} not found.", command.DoctorId);
                    return new UpdateDoctorMediaFailed(command.Id, "Doctor profile not found.");
                }

                doctor.MediaId = command.MediaId;
                doctor.MediaUrl = command.MediaUrl;
                doctor.UpdatedAt = DateTimeOffset.UtcNow;

                await dbContext.SaveChangesAsync();

                await cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);
                logger.LogInformation("Doctor profile linked with new Media ID {MediaId} successfully for Doctor ID {DoctorId}", command.MediaId, command.DoctorId);

                return new UpdateDoctorMediaCompleted(command.Id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "UpdateDoctorMediaCommand failed for Doctor ID {DoctorId}", command.DoctorId);
                return new UpdateDoctorMediaFailed(command.Id, ex.Message);
            }
        }
    }
}
