using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Microsoft.Extensions.Logging;
using Wolverine;

namespace Application.Sagas.UpdateDoctorSaga
{
    public class UpdateDoctorSagaHandler(
        IAuthDbContext dbContext,
        IMessageBus bus,
        ICacheService cache,
        ILogger<UpdateDoctorSagaHandler> logger)
    {
        public async Task Handle(UpdateAuthDoctorCommand command)
        {
            try
            {
                var authDoctor = await dbContext.AuthDoctors.FindAsync(command.DoctorId);
                if (authDoctor == null)
                {
                    await bus.PublishAsync(new UpdateAuthDoctorFailed(command.Id,
                        "Doctor not found in authentication database."));
                    return;
                }

                // If email has changed, we need to clean up the old email cache entry
                var oldEmail = authDoctor.Email;
                if (!string.Equals(oldEmail, command.Email, StringComparison.OrdinalIgnoreCase))
                {
                    await cache.RemoveAsync("user:email:" + oldEmail);
                }

                // Update properties
                authDoctor.FirstName = command.FirstName;
                authDoctor.LastName = command.LastName;
                authDoctor.Email = command.Email;
                authDoctor.PhoneNumber = command.PhoneNumber;
                authDoctor.UpdatedAt = DateTimeOffset.UtcNow;

                await dbContext.SaveChangesAsync();

                // Update Cache
                var guidKey = "user:id:" + authDoctor.Id;
                var emailKey = "user:email:" + authDoctor.Email;
                await cache.SetAsync(guidKey, authDoctor);
                await cache.SetAsync(emailKey, authDoctor);

                await bus.PublishAsync(new UpdateAuthDoctorCompleted(command.Id, command.DoctorId));
                logger.LogInformation("Auth Doctor credentials updated successfully for Doctor ID {DoctorId}",
                    command.DoctorId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to update Auth Doctor credentials for Doctor ID {DoctorId}",
                    command.DoctorId);
                await bus.PublishAsync(new UpdateAuthDoctorFailed(command.Id, ex.Message));
            }
        }

        public async Task Handle(RollbackAuthDoctorCommand command)
        {
            try
            {
                var authDoctor = await dbContext.AuthDoctors.FindAsync(command.DoctorId);
                if (authDoctor != null)
                {
                    var currentEmail = authDoctor.Email;
                    if (!string.Equals(currentEmail, command.Email, StringComparison.OrdinalIgnoreCase))
                    {
                        await cache.RemoveAsync("user:email:" + currentEmail);
                    }

                    authDoctor.FirstName = command.FirstName;
                    authDoctor.LastName = command.LastName;
                    authDoctor.Email = command.Email;
                    authDoctor.PhoneNumber = command.PhoneNumber;
                    authDoctor.UpdatedAt = DateTimeOffset.UtcNow;

                    await dbContext.SaveChangesAsync();

                    var guidKey = "user:id:" + authDoctor.Id;
                    var emailKey = "user:email:" + authDoctor.Email;
                    await cache.SetAsync(guidKey, authDoctor);
                    await cache.SetAsync(emailKey, authDoctor);

                    logger.LogInformation("Auth Doctor credentials rolled back successfully for Doctor ID {DoctorId}",
                        command.DoctorId);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to rollback Auth Doctor credentials for Doctor ID {DoctorId}",
                    command.DoctorId);
            }
        }
    }
}