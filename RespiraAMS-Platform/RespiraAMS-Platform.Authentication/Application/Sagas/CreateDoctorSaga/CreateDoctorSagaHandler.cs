using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Mapping;
using Domain.Entities;
using Microsoft.Extensions.Logging;
using Wolverine;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSagaHandler(
        IAuthDbContext dbContext,
        IMessageBus bus,
        IMap<CreateAuthDoctorCommand, AuthDoctor> map,
        ICacheService cache,
        ILogger<CreateDoctorSagaHandler> logger
    )
    {
        public async Task HandleAsync(CreateAuthDoctorCommand command)
        {
            try
            {
                var validation = new CreateDoctorSagaValidation();
                var validationResult = await validation.ValidateAsync(command);

                if (!validationResult.IsValid)
                {
                    var errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
                    await bus.PublishAsync(new CreateAuthDoctorFailed(command.Id, string.Join(",", errors)));
                    return;
                }

                var authDoctor = map.Map(command);
                await dbContext.AuthDoctors.AddAsync(authDoctor);
                await dbContext.SaveChangesAsync();
                var guidKey = "user:id:" + authDoctor.Id;
                var emailKey = "user:email:" + authDoctor.Email;
                await cache.SetAsync(guidKey, authDoctor);
                await cache.SetAsync(emailKey, authDoctor);
                await bus.PublishAsync(new CreateAuthDoctorCompleted(command.Id));
                logger.LogInformation("Doctor created successfully");
            }
            catch (Exception e)
            {
                logger.LogError(e, "Doctor creation failed");
                await bus.PublishAsync(new CreateAuthDoctorFailed(command.Id, e.Message));
            }
        }

        public async Task Handle(RollbackAuthDoctorCommand command)
        {
            var authDoctor = await dbContext.AuthDoctors.FindAsync(command.Id);
            if (authDoctor != null)
            {
                dbContext.AuthDoctors.Remove(authDoctor);
                await dbContext.SaveChangesAsync();

                var guidKey = "user:id:" + authDoctor.Id;
                var emailKey = "user:email:" + authDoctor.Email;
                await cache.RemoveAsync(guidKey);
                await cache.RemoveAsync(emailKey);
            }
        }
    }
}
