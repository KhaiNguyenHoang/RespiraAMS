using System.Data;
using Domain.Models;
using FluentValidation;

namespace Application.Features.TreatmentDecisions.Shared;

public class CriterionSnapshotValidator : AbstractValidator<CriterionSnapshot>
{
    public CriterionSnapshotValidator()
    {
        RuleFor(x => x.CriteriaId)
            .NotEmpty()
            .WithMessage("Criteria ID is required");
        RuleFor(x => x.CriteriaName)
            .NotEmpty()
            .WithMessage("Criteria Name is required");
        RuleFor(x => x.Value)
            .NotEmpty()
            .When(x => x.Value is not null)
            .WithMessage("Value must not be an empty string");
    }
}