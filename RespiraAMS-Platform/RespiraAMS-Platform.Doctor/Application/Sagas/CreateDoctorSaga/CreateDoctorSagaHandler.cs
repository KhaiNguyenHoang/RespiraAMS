using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Mapping;
using Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSagaHandler(
        IDoctorDbContext dbContext,
        ICacheService cacheService,
        IMap<CreateDoctorCommand, Doctor> mapper,
        IValidator<CreateDoctorCommand> validator,
        ILogger<CreateDoctorSagaHandler> logger
    )
    {
        public async Task<object> Handle(CreateDoctorCommand command)
        {
            try
            {
                var validationResult = await validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {
                    var errors = string.Join(
                        "; ",
                        validationResult.Errors.Select(e => e.ErrorMessage)
                    );
                    logger.LogWarning(
                        "CreateDoctorCommand validation failed for ID {Id}: {Errors}",
                        command.Id,
                        errors
                    );
                    return new CreateDoctorFailed(command.Id, errors);
                }

                var doctor = mapper.Map(command);
                doctor.Id = command.Id;

                dbContext.Doctors.Add(doctor);
                await dbContext.SaveChangesAsync();

                await cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);

                return new CreateDoctorCompleted(command.Id);
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "CreateDoctorCommand execution failed for ID {Id}: {Message}",
                    command.Id,
                    ex.Message
                );
                return new CreateDoctorFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(RollbackDoctorCommand command)
        {
            var doctor = await dbContext.Doctors.FindAsync(command.Id);
            if (doctor != null)
            {
                dbContext.Doctors.Remove(doctor);
                await dbContext.SaveChangesAsync();
            }

            await cacheService.RemoveAsync($"doctor:id:{command.Id}");
        }

        public async Task<object> Handle(UpdateDoctorMediaCommand command)
        {
            try
            {
                var doctor = await dbContext.Doctors.FindAsync(command.Id);
                if (doctor == null)
                {
                    logger.LogWarning(
                        "UpdateDoctorMediaCommand failed: Doctor with ID {Id} not found.",
                        command.Id
                    );
                    return new UpdateDoctorMediaFailed(command.Id, "Doctor not found.");
                }

                doctor.MediaId = command.MediaId;
                doctor.MediaUrl = command.MediaUrl;
                doctor.UpdatedAt = DateTimeOffset.UtcNow;

                await dbContext.SaveChangesAsync();

                await cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);

                return new UpdateDoctorMediaCompleted(command.Id);
            }
            catch (Exception ex)
            {
                logger.LogError(
                    ex,
                    "UpdateDoctorMediaCommand failed for ID {Id}: {Message}",
                    command.Id,
                    ex.Message
                );
                return new UpdateDoctorMediaFailed(command.Id, ex.Message);
            }
        }
    }
}
