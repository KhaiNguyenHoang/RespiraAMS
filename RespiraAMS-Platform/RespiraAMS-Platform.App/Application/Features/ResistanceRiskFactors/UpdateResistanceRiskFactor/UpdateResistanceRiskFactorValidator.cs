using Application.Shared.Validations;
using FluentValidation;

namespace Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;

public class UpdateResistanceRiskFactorValidator : AbstractValidator<UpdateResistanceRiskFactorCommand>
{
    public UpdateResistanceRiskFactorValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Resistance risk factor name is required");
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Resistance risk factor ID is required");
        RuleFor(x => x.PathogenId)
            .NotEmpty()
            .WithMessage("Pathogen ID is required");
        RuleFor(x => x.Criterion)
            .SetValidator(new UpdateCriterionValidator());
    }
}