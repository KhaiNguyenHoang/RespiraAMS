using Application.DTOs;
using FluentValidation;

namespace Application.Features.Profile
{
    public class UpdateDoctorDtoValidator : AbstractValidator<UpdateDoctorDto>
    {
        public UpdateDoctorDtoValidator()
        {
            RuleFor(x => x.FirstName).NotEmpty().WithMessage("First name is required");

            RuleFor(x => x.LastName).NotEmpty().WithMessage("Last name is required");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress()
                .WithMessage("Email is invalid");

            RuleFor(x => x.PhoneNumber).NotEmpty().WithMessage("Phone number is required");

            RuleFor(x => x.Address).NotEmpty().WithMessage("Address is required");

            RuleFor(x => x.Degrees)
                .NotEmpty()
                .WithMessage("At least one degree is required")
                .Must(x => x?.Count > 0)
                .WithMessage("At least one degree is required");

            RuleFor(x => x.CitizenIdentificationCard)
                .NotEmpty()
                .WithMessage("Citizen Identification Card is required");

            RuleFor(x => x.DateOfBirth)
                .NotEmpty()
                .WithMessage("Date of birth is required")
                .LessThan(DateTimeOffset.UtcNow)
                .WithMessage("Date of birth must be in the past");

            RuleFor(x => x.Position).NotEmpty().WithMessage("Position is required");
        }
    }
}
