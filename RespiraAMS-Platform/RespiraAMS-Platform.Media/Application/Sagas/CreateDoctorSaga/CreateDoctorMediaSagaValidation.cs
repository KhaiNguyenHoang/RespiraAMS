using FluentValidation;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorMediaSagaValidation : AbstractValidator<CreateMediaCommand>
    {
        public CreateDoctorMediaSagaValidation()
        {
            RuleFor(x => x.Avatar)
                .NotEmpty()
                .WithMessage("Avatar data is required.");
        }
    }
}
