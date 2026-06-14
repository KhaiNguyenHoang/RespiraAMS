using FluentValidation;

namespace Application.Features.DiseasePathogens.CreateDiseasePathogen;

public class CreateDiseasePathogenValidator : AbstractValidator<CreateDiseasePathogenCommand>
{
    public CreateDiseasePathogenValidator()
    {
        RuleFor(x => x.DiseaseId)
            .NotEmpty()
            .WithMessage("Disease ID is required");
        RuleFor(x => x.PathogenId)
            .NotEmpty()
            .WithMessage("Pathogen ID is required");
        RuleFor(x => x.Severity)
            .IsInEnum()
            .WithMessage("Invalid value for severity");
        RuleFor(x => x.TreatmentSite)
            .IsInEnum()
            .WithMessage("Invalid value for treatment site");
    }
}