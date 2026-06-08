using FluentValidation;

namespace Application.Sagas.UpdateDoctorSaga
{
    public class UpdateDoctorSagaValidation : AbstractValidator<UpdateMediaCommand>
    {
        public UpdateDoctorSagaValidation()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Saga Id is required");
            RuleFor(x => x.DoctorId).NotEmpty().WithMessage("DoctorId is required");
            RuleFor(x => x.Avatar).NotEmpty().WithMessage("Avatar content is required");
        }
    }
}
