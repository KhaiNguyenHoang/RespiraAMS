using FluentValidation;

namespace Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;

public class CreateAntibioticSpectrumValidator : AbstractValidator<CreateAntibioticSpectrumCommand>
{
    public CreateAntibioticSpectrumValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Antibiotic spectrum name is required");
        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Antibiotic spectrum description is required");
    }
}