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
        private readonly IMessageBus _bus = bus;
        private readonly IAuthDbContext _dbContext = dbContext;
        private readonly IMap<CreateAuthDoctorCommand, AuthDoctor> _map = map;
        private readonly ICacheService _cache = cache;
        private readonly ILogger<CreateDoctorSagaHandler> _logger = logger;

        public async Task Handle(CreateAuthDoctorCommand command)
        {
            try
            {
                var validation = new CreateDoctorSagaValidation();
                var validationResult = validation.Validate(command);

                if (!validationResult.IsValid)
                {
                    var errors = validationResult.Errors.Select(x => x.ErrorMessage).ToList();
                    await _bus.PublishAsync(
                        new CreateAuthDoctorFailed(command.Id, string.Join(",", errors))
                    );
                    return;
                }

                var authDoctor = _map.Map(command);
                await _dbContext.AuthDoctors.AddAsync(authDoctor);
                await _dbContext.SaveChangesAsync();
                var guidKey = "user:id:" + authDoctor.Id;
                var emailKey = "user:email:" + authDoctor.Email;
                await _cache.SetAsync(guidKey, authDoctor);
                await _cache.SetAsync(emailKey, authDoctor);
                await _bus.PublishAsync(new CreateAuthDoctorCompleted(command.Id));
                _logger.LogInformation("Doctor created successfully");
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Doctor creation failed");
                await _bus.PublishAsync(new CreateAuthDoctorFailed(command.Id, e.Message));
            }
        }

        public async Task Handle(RollbackAuthDoctorCommand command)
        {
            var authDoctor = await _dbContext.AuthDoctors.FindAsync(command.Id);
            if (authDoctor != null)
            {
                _dbContext.AuthDoctors.Remove(authDoctor);
                await _dbContext.SaveChangesAsync();

                var guidKey = "user:id:" + authDoctor.Id;
                var emailKey = "user:email:" + authDoctor.Email;
                await _cache.RemoveAsync(guidKey);
                await _cache.RemoveAsync(emailKey);
            }
        }
    }
}
