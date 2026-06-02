using FluentValidation;

namespace Application.Sagas.CreateDoctorSaga
{
    public class CreateDoctorCommandHandler : AbstractValidator<CreateDoctorCommand>
    {
        public CreateDoctorCommandHandler()
        {
            RuleFor(x => x.Address)
                .NotEmpty()
                .WithMessage("Address is required.");

            RuleFor(x => x.Degrees)
                .NotEmpty()
                .WithMessage("Degrees are required.");

            RuleFor(x => x.CitizenIdentificationCard)
                .NotEmpty()
                .WithMessage("Citizen Identification Card is required.");

            RuleFor(x => x.Position)
                .NotEmpty()
                .WithMessage("Position is required.");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage("Date of birth is required.")
                .Must(dob => dob.HasValue && dob.Value <= DateTimeOffset.UtcNow.AddYears(-18))
                .WithMessage("Doctor must be at least 18 years old.");
        }
    }
}
