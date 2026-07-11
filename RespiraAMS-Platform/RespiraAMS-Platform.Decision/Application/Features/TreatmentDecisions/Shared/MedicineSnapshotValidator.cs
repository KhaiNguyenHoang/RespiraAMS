using Domain.Models;
using FluentValidation;

namespace Application.Features.TreatmentDecisions.Shared;

public class MedicineSnapshotValidator : AbstractValidator<MedicineSnapshot>
{
    public MedicineSnapshotValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Medicine name is required");
        RuleFor(x => x.AntibioticSpectrum)
            .NotEmpty()
            .WithMessage("Medicine antibiotic spectrum is required");
        RuleFor(x => x.Category)
            .NotEmpty()
            .WithMessage("Medicine category is required");
        // Here, we assume that the dosage value is correct without detail validation
        RuleFor(x => x.Dosages)
            .NotEmpty()
            .WithMessage("Medicine dosages is required");
    }
}