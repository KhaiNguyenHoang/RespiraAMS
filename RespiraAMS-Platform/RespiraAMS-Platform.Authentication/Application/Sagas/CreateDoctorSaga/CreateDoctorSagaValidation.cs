using FluentValidation;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorSagaValidation : AbstractValidator<CreateAuthDoctorCommand>
    {
        public CreateDoctorSagaValidation()
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required");

            RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required");

            RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required");

            RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Email is invalid");

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8)
                .Matches("[A-Z]")
                .WithMessage("Password must contain at least one uppercase letter")
                .Matches("[a-z]")
                .WithMessage("Password must contain at least one lowercase letter")
                .Matches("[0-9]")
                .WithMessage("Password must contain at least one digit")
                .Matches(@"[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>/?]")
                .WithMessage("Password must contain at least one special character");
        }
    }
}
