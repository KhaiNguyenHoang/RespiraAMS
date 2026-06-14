using FluentValidation;

namespace Application.Features.Diseases.CreateDisease;

public class CreateDiseaseValidator : AbstractValidator<CreateDiseaseCommand>
{
    public CreateDiseaseValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Disease name is required");
        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Disease description is required");
        RuleFor(x => x.RequiredIcuMainCriteria)
            .GreaterThan(0)
            .WithMessage("Disease required main criteria for ICU hospitalization must be positive integer");
        RuleFor(x => x.RequiredIcuSecondaryCriteria)
            .GreaterThan(0)
            .WithMessage("Disease required secondary criteria for ICU hospitalization must be positive integer");
    }
}