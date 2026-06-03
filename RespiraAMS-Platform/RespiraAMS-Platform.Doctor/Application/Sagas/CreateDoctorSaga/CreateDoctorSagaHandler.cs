using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Mapping;
using Domain.Entities;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSagaHandler
    {
        private readonly IDoctorDbContext _dbContext;
        private readonly ICacheService _cacheService;
        private readonly IMap<CreateDoctorCommand, Doctor> _mapper;
        private readonly IValidator<CreateDoctorCommand> _validator;
        private readonly ILogger<CreateDoctorSagaHandler> _logger;

        public CreateDoctorSagaHandler(
            IDoctorDbContext dbContext,
            ICacheService cacheService,
            IMap<CreateDoctorCommand, Doctor> mapper,
            IValidator<CreateDoctorCommand> validator,
            ILogger<CreateDoctorSagaHandler> logger
        )
        {
            _dbContext = dbContext;
            _cacheService = cacheService;
            _mapper = mapper;
            _validator = validator;
            _logger = logger;
        }

        public async Task<object> Handle(CreateDoctorCommand command)
        {
            try
            {
                var validationResult = await _validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {
                    var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
                    _logger.LogWarning("CreateDoctorCommand validation failed for ID {Id}: {Errors}", command.Id, errors);
                    return new CreateDoctorFailed(command.Id, errors);
                }

                var doctor = _mapper.Map(command);
                doctor.Id = command.Id;

                _dbContext.Doctors.Add(doctor);
                await _dbContext.SaveChangesAsync();

                await _cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);

                return new CreateDoctorCompleted(command.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CreateDoctorCommand execution failed for ID {Id}: {Message}", command.Id, ex.Message);
                return new CreateDoctorFailed(command.Id, ex.Message);
            }
        }

        public async Task Handle(RollbackDoctorCommand command)
        {
            var doctor = await _dbContext.Doctors.FindAsync(command.Id);
            if (doctor != null)
            {
                _dbContext.Doctors.Remove(doctor);
                await _dbContext.SaveChangesAsync();
            }

            await _cacheService.RemoveAsync($"doctor:id:{command.Id}");
        }

        public async Task<object> Handle(UpdateDoctorMediaCommand command)
        {
            try
            {
                var doctor = await _dbContext.Doctors.FindAsync(command.Id);
                if (doctor == null)
                {
                    _logger.LogWarning("UpdateDoctorMediaCommand failed: Doctor with ID {Id} not found.", command.Id);
                    return new UpdateDoctorMediaFailed(command.Id, "Doctor not found.");
                }

                doctor.MediaId = command.MediaId;
                doctor.MediaUrl = command.MediaUrl;
                doctor.UpdatedAt = DateTimeOffset.UtcNow;

                await _dbContext.SaveChangesAsync();

                await _cacheService.SetAsync($"doctor:id:{doctor.Id}", doctor);

                return new UpdateDoctorMediaCompleted(command.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateDoctorMediaCommand failed for ID {Id}: {Message}", command.Id, ex.Message);
                return new UpdateDoctorMediaFailed(command.Id, ex.Message);
            }
        }
    }
}
