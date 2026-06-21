using Domain.Models;
using FluentValidation;

namespace Application.Features.TreatmentDecisions.Shared;

public class TreatmentProtocolSnapshotValidator : AbstractValidator<TreatmentProtocolSnapshot>
{
    public TreatmentProtocolSnapshotValidator()
    {
        RuleFor(x => x.TreatmentProtocolId)
            .NotEmpty()
            .WithMessage("Treatment protocol ID is required");
        RuleFor(x => x.TreatmentProtocolName)
            .NotEmpty()
            .WithMessage("Treatment protocol name is required");
        RuleFor(x => x.TreatmentProtocolIssuer)
            .NotEmpty()
            .WithMessage("Treatment protocol issuer is required");
        RuleFor(x => x.TreatmentProtocolIssueDate)
            .NotEmpty()
            .WithMessage("Treatment protocol issue date is required")
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.Today))
            .WithMessage("Treatment protocol issue date must not be in future");
        RuleFor(x => x.TreatmentProtocolVersion)
            .NotEmpty()
            .WithMessage("Treatment protocol version is required");
        RuleFor(x => x.Medicines)
            .NotEmpty()
            .WithMessage("Medicines is required");
        RuleForEach(x => x.Medicines)
            .SetValidator(new MedicineSnapshotValidator());
    }
}