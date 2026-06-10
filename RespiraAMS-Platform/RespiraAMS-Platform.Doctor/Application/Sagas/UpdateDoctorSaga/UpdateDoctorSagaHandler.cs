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
        private readonly IDoctorDbContext _dbContext = dbContext;
        private readonly ICacheService _cacheService = cacheService;
        private readonly IValidator<UpdateDoctorCommand> _validator = validator;
        private readonly ILogger<UpdateDoctorSagaHandler> _logger = logger;

        private List<DegreeEnum> ParseDegrees(ICollection<string> degrees)
        {
            var degreeStrings = new List<string>();
            if (degrees != null)
            {
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
            }
            return degreeStrings.Select(d => Enum.Parse<DegreeEnum>(d.Trim(), true)).ToList();
        }

        public async Task<object> Handle(UpdateDoctorCommand command)
        {
            try
            {
                var validationResult = await _validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {
                    var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                    _logger.LogWarning("UpdateDoctorCommand validation failed for Doctor ID {DoctorId}: {Errors}", command.DoctorId, errors);
                    return new UpdateDoctorFailed(command.Id, errors);
                }

                var doctor = await _dbContext.Doctors.FindAsync(command.DoctorId);
                if (doctor == null)
                {
                    _logger.LogWarning("UpdateDoctorCommand failed: Doctor with ID {DoctorId} not found.", command.DoctorId);
                    return new UpdateDoctorFailed(command.Id, "Doctor profile not found.");
                }

                // Backup old Profile values
                var oldAddress = doctor.Address;
                var oldDegrees = doctor.Degrees;
                var oldAcademicTitle = doctor.AcademicTitle;
                var oldCitizenCard = doctor.CitizenIdentificationCard;
                var oldGender = doctor.Gender;
                var oldDOB = doctor.DateOfBirth;
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

                await _dbContext.SaveChangesAsync();

                // Update cache
                await _cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);

                _logger.LogInformation("Doctor profile updated successfully for Doctor ID {DoctorId}", command.DoctorId);

                return new UpdateDoctorCompleted(
                    command.Id,
                    oldAddress,
                    [.. oldDegrees.Select(d => d.ToString())],
                    oldAcademicTitle?.ToString() ?? "None",
                    oldCitizenCard,
                    oldDOB,
                    oldGender,
                    oldPosition.ToString(),
                    oldMediaId,
                    oldMediaUrl
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateDoctorCommand failed for Doctor ID {DoctorId}", command.DoctorId);
                return new UpdateDoctorFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(RollbackDoctorCommand command)
        {
            try
            {
                var doctor = await _dbContext.Doctors.FindAsync(command.DoctorId);
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

                    await _dbContext.SaveChangesAsync();

                    await _cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);
                    _logger.LogInformation("Doctor profile rolled back successfully for Doctor ID {DoctorId}", command.DoctorId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "RollbackDoctorCommand failed for Doctor ID {DoctorId}", command.DoctorId);
            }
        }

        public async Task<object> Handle(UpdateDoctorMediaCommand command)
        {
            try
            {
                var doctor = await _dbContext.Doctors.FindAsync(command.DoctorId);
                if (doctor == null)
                {
                    _logger.LogWarning("UpdateDoctorMediaCommand failed: Doctor with ID {DoctorId} not found.", command.DoctorId);
                    return new UpdateDoctorMediaFailed(command.Id, "Doctor profile not found.");
                }

                doctor.MediaId = command.MediaId;
                doctor.MediaUrl = command.MediaUrl;
                doctor.UpdatedAt = DateTimeOffset.UtcNow;

                await _dbContext.SaveChangesAsync();

                await _cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);
                _logger.LogInformation("Doctor profile linked with new Media ID {MediaId} successfully for Doctor ID {DoctorId}", command.MediaId, command.DoctorId);

                return new UpdateDoctorMediaCompleted(command.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateDoctorMediaCommand failed for Doctor ID {DoctorId}", command.DoctorId);
                return new UpdateDoctorMediaFailed(command.Id, ex.Message);
            }
        }
    }
}
