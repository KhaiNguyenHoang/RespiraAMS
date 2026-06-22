using FluentValidation;

namespace Application.Features.DiseasePathogens.UpdateDiseasePathogen;

public class UpdateDiseasePathogenValidator : AbstractValidator<UpdateDiseasePathogenCommand>
{
    public UpdateDiseasePathogenValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Disease pathogen ID is required");
        RuleFor(x => x.Severity)
            .IsInEnum()
            .WithMessage("Invalid value for severity");
        RuleFor(x => x.TreatmentSite)
            .IsInEnum()
            .WithMessage("Invalid value for treatment site");
    }
}