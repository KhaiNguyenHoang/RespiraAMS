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
        private readonly IAuthDbContext _dbContext = dbContext;
        private readonly IMessageBus _bus = bus;
        private readonly ICacheService _cache = cache;
        private readonly ILogger<DeleteDoctorSagaHandler> _logger = logger;

        public async Task Handle(DeleteAuthDoctorCommand command)
        {
            try
            {
                var authDoctor = await _dbContext.AuthDoctors.FindAsync(command.DoctorId);
                if (authDoctor == null)
                {
                    await _bus.PublishAsync(new DeleteAuthDoctorFailed(command.Id, "Doctor credentials not found."));
                    return;
                }

                authDoctor.IsDeleted = true;
                authDoctor.DeletedAt = DateTimeOffset.UtcNow;
                await _dbContext.SaveChangesAsync();

                var guidKey = "user:id:" + command.DoctorId;
                var emailKey = "user:email:" + authDoctor.Email;
                await _cache.RemoveAsync(guidKey);
                await _cache.RemoveAsync(emailKey);

                await _bus.PublishAsync(new DeleteAuthDoctorCompleted(command.Id));
                _logger.LogInformation("Soft-deleted AuthDoctor credentials successfully for Doctor ID {DoctorId}", command.DoctorId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to soft-delete AuthDoctor credentials for Doctor ID {DoctorId}", command.DoctorId);
                await _bus.PublishAsync(new DeleteAuthDoctorFailed(command.Id, ex.Message));
            }
        }

        public async Task Handle(RollbackDeleteAuthDoctorCommand command)
        {
            try
            {
                var existing = await _dbContext.AuthDoctors.FindAsync(command.DoctorId);
                if (existing != null)
                {
                    existing.IsDeleted = false;
                    existing.DeletedAt = null;
                    await _dbContext.SaveChangesAsync();

                    var guidKey = "user:id:" + existing.Id;
                    var emailKey = "user:email:" + existing.Email;
                    await _cache.SetAsync(guidKey, existing);
                    await _cache.SetAsync(emailKey, existing);

                    _logger.LogInformation("Restored (un-deleted) AuthDoctor credentials during rollback for Doctor ID {DoctorId}", command.DoctorId);
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

                    await _dbContext.AuthDoctors.AddAsync(authDoctor);
                    await _dbContext.SaveChangesAsync();

                    var guidKey = "user:id:" + authDoctor.Id;
                    var emailKey = "user:email:" + authDoctor.Email;
                    await _cache.SetAsync(guidKey, authDoctor);
                    await _cache.SetAsync(emailKey, authDoctor);

                    _logger.LogInformation("Restored (re-created) AuthDoctor credentials during rollback for Doctor ID {DoctorId}", command.DoctorId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to restore AuthDoctor credentials for Doctor ID {DoctorId} in rollback", command.DoctorId);
            }
        }
    }
}
