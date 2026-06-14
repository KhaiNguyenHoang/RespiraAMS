using FluentValidation;

namespace Application.Features.ResistanceRiskFactors.DeleteResistanceRiskFactor;

public class DeleteResistanceRiskFactorValidator : AbstractValidator<DeleteResistanceRiskFactorCommand>
{
    public DeleteResistanceRiskFactorValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Resistance risk factor ID is required");
    }
}