using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Domain.Entities;
using Domain.Enums;
using Microsoft.Extensions.Logging;

namespace Application.Sagas.DeleteDoctorSaga
{
    public class DeleteDoctorSagaHandler(
        IDoctorDbContext dbContext,
        ICacheService cacheService,
        ILogger<DeleteDoctorSagaHandler> logger
    )
    {
        private readonly IDoctorDbContext _dbContext = dbContext;
        private readonly ICacheService _cacheService = cacheService;
        private readonly ILogger<DeleteDoctorSagaHandler> _logger = logger;

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

        public async Task<object> Handle(DeleteDoctorCommand command)
        {
            try
            {
                var doctor = await _dbContext.Doctors.FindAsync(command.DoctorId);
                if (doctor == null || doctor.IsDeleted)
                {
                    _logger.LogWarning("DeleteDoctorCommand failed: Doctor with ID {DoctorId} not found or already deleted.", command.DoctorId);
                    return new DeleteDoctorFailed(command.Id, "Doctor profile not found or already deleted.");
                }

                // Backup Profile values before deleting
                var address = doctor.Address;
                var degrees = doctor.Degrees;
                var academicTitle = doctor.AcademicTitle;
                var citizenCard = doctor.CitizenIdentificationCard;
                var dob = doctor.DateOfBirth;
                var gender = doctor.Gender;
                var position = doctor.Position;
                var mediaId = doctor.MediaId;
                var mediaUrl = doctor.MediaUrl;

                doctor.IsDeleted = true;
                doctor.DeletedAt = DateTimeOffset.UtcNow;
                await _dbContext.SaveChangesAsync();

                // Remove from cache
                await _cacheService.RemoveAsync($"doctor:id:{command.DoctorId}");

                _logger.LogInformation("Doctor profile soft-deleted successfully for Doctor ID {DoctorId}", command.DoctorId);

                return new DeleteDoctorCompleted(
                    command.Id,
                    address,
                    [.. degrees.Select(d => d.ToString())],
                    academicTitle?.ToString() ?? "None",
                    citizenCard,
                    dob,
                    gender,
                    position.ToString(),
                    mediaId,
                    mediaUrl
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteDoctorCommand failed for Doctor ID {DoctorId}", command.DoctorId);
                return new DeleteDoctorFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(RollbackDeleteDoctorCommand command)
        {
            try
            {
                var existing = await _dbContext.Doctors.FindAsync(command.DoctorId);
                if (existing != null)
                {
                    existing.IsDeleted = false;
                    existing.DeletedAt = null;
                    await _dbContext.SaveChangesAsync();

                    await _cacheService.SetAsync($"doctor:id:{existing.Id}", existing);
                    _logger.LogInformation("Restored (un-deleted) Doctor profile during rollback for Doctor ID {DoctorId}", command.DoctorId);
                }
                else
                {
                    var doctor = new Doctor
                    {
                        Id = command.DoctorId,
                        Address = command.Address,
                        Degrees = ParseDegrees(command.Degrees),
                        AcademicTitle = string.IsNullOrWhiteSpace(command.AcademicTitle) || command.AcademicTitle.Equals("None", StringComparison.OrdinalIgnoreCase) 
                            ? null 
                            : Enum.Parse<AcademicTitleEnum>(command.AcademicTitle.Trim(), true),
                        CitizenIdentificationCard = command.CitizenIdentificationCard,
                        DateOfBirth = command.DateOfBirth,
                        Gender = command.Gender,
                        Position = Enum.Parse<PositionEnum>(command.Position.Trim(), true),
                        MediaId = command.MediaId,
                        MediaUrl = command.MediaUrl,
                        CreatedAt = DateTimeOffset.UtcNow,
                        IsDeleted = false,
                        DeletedAt = null
                    };

                    _dbContext.Doctors.Add(doctor);
                    await _dbContext.SaveChangesAsync();

                    await _cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);
                    _logger.LogInformation("Restored Doctor profile during rollback for Doctor ID {DoctorId}", command.DoctorId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to restore Doctor profile for Doctor ID {DoctorId} in rollback", command.DoctorId);
            }
        }
    }
}
