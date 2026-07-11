using FluentValidation;

namespace Application.Features.AntibioticSpectra.UpdateAntibioticSpectrum;

public class UpdateAntibioticSpectrumValidator : AbstractValidator<UpdateAntibioticSpectrumCommand>
{
    public UpdateAntibioticSpectrumValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Antibiotic spectrum ID is required");
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Antibiotic spectrum name is required");
        RuleFor(x => x.Description)
            .NotEmpty()
            .WithMessage("Antibiotic spectrum description is required");
    }
}
