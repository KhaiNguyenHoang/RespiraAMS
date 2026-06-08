using FluentValidation;

namespace Application.Sagas.UpdateDoctorSaga
{
    public class UpdateDoctorSagaValidation : AbstractValidator<StartUpdateDoctorSaga>
    {
        public UpdateDoctorSagaValidation()
        {
            RuleFor(x => x.DoctorId).NotEmpty().WithMessage("DoctorId is required");
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required");
            RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required");
            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Email is invalid");
            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("Phone number is required");
        }
    }
}
