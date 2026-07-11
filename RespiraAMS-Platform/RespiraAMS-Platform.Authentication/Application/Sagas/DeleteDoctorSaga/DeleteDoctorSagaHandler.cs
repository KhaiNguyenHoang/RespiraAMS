using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Domain.Entities;
using Domain.Enums;
using Microsoft.Extensions.Logging;
using Wolverine;

namespace Application.Sagas.DeleteDoctorSaga
{
    public class DeleteDoctorSagaHandler(
        IAuthDbContext dbContext,
        IMessageBus bus,
        ICacheService cache,
        ILogger<DeleteDoctorSagaHandler> logger
    )
    {
        public async Task Handle(DeleteAuthDoctorCommand command)
        {
            try
            {
                var authDoctor = await dbContext.AuthDoctors.FindAsync(command.DoctorId);
                if (authDoctor == null)
                {
                    await bus.PublishAsync(new DeleteAuthDoctorFailed(command.Id, "Doctor credentials not found."));
                    return;
                }

                authDoctor.IsDeleted = true;
                authDoctor.DeletedAt = DateTimeOffset.UtcNow;
                await dbContext.SaveChangesAsync();

                var guidKey = "user:id:" + command.DoctorId;
                var emailKey = "user:email:" + authDoctor.Email;
                await cache.RemoveAsync(guidKey);
                await cache.RemoveAsync(emailKey);

                await bus.PublishAsync(new DeleteAuthDoctorCompleted(command.Id));
                logger.LogInformation("Soft-deleted AuthDoctor credentials successfully for Doctor ID {DoctorId}", command.DoctorId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to soft-delete AuthDoctor credentials for Doctor ID {DoctorId}", command.DoctorId);
                await bus.PublishAsync(new DeleteAuthDoctorFailed(command.Id, ex.Message));
            }
        }

        public async Task Handle(RollbackDeleteAuthDoctorCommand command)
        {
            try
            {
                var existing = await dbContext.AuthDoctors.FindAsync(command.DoctorId);
                if (existing != null)
                {
                    existing.IsDeleted = false;
                    existing.DeletedAt = null;
                    await dbContext.SaveChangesAsync();

                    var guidKey = "user:id:" + existing.Id;
                    var emailKey = "user:email:" + existing.Email;
                    await cache.SetAsync(guidKey, existing);
                    await cache.SetAsync(emailKey, existing);

                    logger.LogInformation("Restored (un-deleted) AuthDoctor credentials during rollback for Doctor ID {DoctorId}", command.DoctorId);
                }
                else
                {
                    var authDoctor = new AuthDoctor
                    {
                        Id = command.DoctorId,
                        FirstName = command.FirstName,
                        LastName = command.LastName,
                        Role = Enum.Parse<RoleEnum>(command.Role),
                        Email = command.Email,
                        Password = command.Password, // restore already hashed password
                        PhoneNumber = command.PhoneNumber,
                        CreatedAt = DateTimeOffset.UtcNow,
                        IsDeleted = false,
                        DeletedAt = null
                    };

                    await dbContext.AuthDoctors.AddAsync(authDoctor);
                    await dbContext.SaveChangesAsync();

                    var guidKey = "user:id:" + authDoctor.Id;
                    var emailKey = "user:email:" + authDoctor.Email;
                    await cache.SetAsync(guidKey, authDoctor);
                    await cache.SetAsync(emailKey, authDoctor);

                    logger.LogInformation("Restored (re-created) AuthDoctor credentials during rollback for Doctor ID {DoctorId}", command.DoctorId);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to restore AuthDoctor credentials for Doctor ID {DoctorId} in rollback", command.DoctorId);
            }
        }
    }
}
