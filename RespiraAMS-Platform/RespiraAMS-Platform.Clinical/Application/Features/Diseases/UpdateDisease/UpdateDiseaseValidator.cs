using FluentValidation;

namespace Application.Features.Diseases.UpdateDisease;


public class UpdateDiseaseValidator : AbstractValidator<UpdateDiseaseCommand>
{
    public UpdateDiseaseValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Disease ID is required");
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