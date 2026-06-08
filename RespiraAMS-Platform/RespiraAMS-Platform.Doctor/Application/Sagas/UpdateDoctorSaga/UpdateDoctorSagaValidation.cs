using FluentValidation;

namespace Application.Sagas.UpdateDoctorSaga
{
    public class UpdateDoctorSagaValidation : AbstractValidator<UpdateDoctorCommand>
    {
        public UpdateDoctorSagaValidation()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Saga Id is required");
            RuleFor(x => x.DoctorId).NotEmpty().WithMessage("DoctorId is required");
            RuleFor(x => x.Address).NotEmpty().WithMessage("Address is required");
            RuleFor(x => x.CitizenIdentificationCard).NotEmpty().WithMessage("Citizen Identification Card is required");
            RuleFor(x => x.Position).NotEmpty().WithMessage("Position is required");
        }
    }
}
