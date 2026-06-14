using Application.Features.Antibiotics.Shared;
using FluentValidation;

namespace Application.Features.Antibiotics.CreateAntibiotics;

public class CreateAntibioticValidator : AbstractValidator<CreateAntibioticCommand>
{
    public CreateAntibioticValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Antibiotic name is required");
        RuleFor(x => x.AntibioticSpectrumId)
            .NotEmpty()
            .WithMessage("Antibiotic spectrum ID is required");
        RuleFor(x => x.Category)
            .IsInEnum()
            .WithMessage("Invalid value for antibiotic category");
        RuleFor(x => x.Dosages).IsDosagesValid();
    }
}