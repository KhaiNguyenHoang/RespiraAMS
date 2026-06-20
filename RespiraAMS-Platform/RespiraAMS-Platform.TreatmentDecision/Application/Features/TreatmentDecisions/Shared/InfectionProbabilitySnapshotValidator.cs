using Domain.Models;
using FluentValidation;

namespace Application.Features.TreatmentDecisions.Shared;

public class InfectionProbabilitySnapshotValidator : AbstractValidator<InfectionProbabilitySnapshot>
{
    public InfectionProbabilitySnapshotValidator()
    {
        RuleFor(x => x.PathogenId)
            .NotEmpty()
            .WithMessage("Pathogen ID is required");
        RuleFor(x => x.PathogenName)
            .NotEmpty()
            .WithMessage("Pathogen name is required");
        RuleFor(x => x.InfectionProbability)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(1)
            .WithMessage("Infection probability is required, and must be a number in range [0, 1]");
    }
}