using Application.Features.TreatmentDecisions.Shared;
using FluentValidation;

namespace Application.Features.TreatmentDecisions.CreateTreatmentDecision;

public class CreateTreatmentDecisionValidator : AbstractValidator<CreateTreatmentDecisionCommand>
{
    public CreateTreatmentDecisionValidator()
    {
        RuleFor(x => x.DiseaseId)
            .NotEmpty()
            .WithMessage("Disease ID is required");
        RuleFor(x => x.DiseaseName)
            .NotEmpty()
            .WithMessage("Disease name is required");
        RuleFor(x => x.DoctorId)
            .NotEmpty()
            .WithMessage("Doctor ID is required");
        RuleFor(x => x.DoctorName)
            .NotEmpty()
            .WithMessage("Doctor name is required");
        RuleFor(x => x.Severity)
            .NotEmpty()
            .WithMessage("Severity is required");
        RuleFor(x => x.TreatmentSite)
            .NotEmpty()
            .WithMessage("Treatment site is required");
        RuleForEach(x => x.InfectionProbabilitySnapshots)
            .SetValidator(new InfectionProbabilitySnapshotValidator())
            .When(x => x.InfectionProbabilitySnapshots.Any());
        RuleForEach(x => x.CriteriaSnapshots)
            .SetValidator(new CriterionSnapshotValidator())
            .When(x => x.CriteriaSnapshots.Any());
        RuleFor(x => x.Recommended)
            .SetValidator(new TreatmentProtocolSnapshotValidator());
        RuleFor(x => x.Chosen)
            .SetValidator(new TreatmentProtocolSnapshotValidator());
        RuleFor(x => x.Reason)
            .NotEmpty()
            .When(x => x.Reason is not null)
            .WithMessage("Reason must not be empty string");
    }
}