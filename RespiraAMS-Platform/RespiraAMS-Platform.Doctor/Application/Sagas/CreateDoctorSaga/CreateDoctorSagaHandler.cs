using Application.Abstracts.Caching;
using Application.Abstracts.Data;
using Application.Abstracts.Mapping;
using Domain.Entities;
using FluentValidation;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSagaHandler
    {
        private readonly IDoctorDbContext _dbContext;
        private readonly ICacheService _cacheService;
        private readonly IMap<CreateDoctorCommand, Doctor> _mapper;
        private readonly IValidator<CreateDoctorCommand> _validator;

        public CreateDoctorSagaHandler(
            IDoctorDbContext dbContext,
            ICacheService cacheService,
            IMap<CreateDoctorCommand, Doctor> mapper,
            IValidator<CreateDoctorCommand> validator
        )
        {
            _dbContext = dbContext;
            _cacheService = cacheService;
            _mapper = mapper;
            _validator = validator;
        }

        public async Task<object> Handle(CreateDoctorCommand command)
        {
            try
            {
                var validationResult = await _validator.ValidateAsync(command);
                if (!validationResult.IsValid)
                {
                    var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
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
    }
}
