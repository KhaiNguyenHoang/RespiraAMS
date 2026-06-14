using FluentValidation;

namespace Application.Features.Diagnose;

public class DiagnoseValidator : AbstractValidator<DiagnoseQuery>
{
    public DiagnoseValidator()
    {
        RuleFor(x => x.DiseaseId)
            .NotEmpty()
            .WithMessage("DiagnoseId is required");
        RuleFor(x => x.Urea)
            .GreaterThan(0)
            .When(x => x.Urea != null)
            .WithMessage("Urea must be greater than 0");
        RuleFor(x => x.Respiratory)
            .GreaterThan(0)
            .WithMessage("Respiratory must be greater than 0");
        RuleFor(x => x.Systolic)
            .GreaterThan(0)
            .WithMessage("Systolic blood pressure must be greater than 0");
        RuleFor(x => x.Diastolic)
            .GreaterThan(0)
            .WithMessage("Diastolic blood pressure must be greater than 0");
        RuleFor(x => x.Age)
            .GreaterThan(0)
            .WithMessage("Age must be greater than 0");
        RuleForEach(x => x.IcuHospitalizeCriteria)
            .NotEmpty()
            .When(x => x.IcuHospitalizeCriteria.Count > 0)
            .WithMessage("ICU Hospitalize criteria IDs must be valid (not empty UUID)");
        RuleForEach(x => x.ResistanceRiskFactors)
            .NotEmpty()
            .When(x => x.ResistanceRiskFactors.Count > 0)
            .WithMessage("Resistance Risk Factor IDs must be valid (not empty UUID)");
        RuleForEach(x => x.OtherCriteria)
            .NotEmpty()
            .When(x => x.OtherCriteria.Count > 0)
            .WithMessage("Other Criteria IDs must be valid (not empty UUID)");
    }
}