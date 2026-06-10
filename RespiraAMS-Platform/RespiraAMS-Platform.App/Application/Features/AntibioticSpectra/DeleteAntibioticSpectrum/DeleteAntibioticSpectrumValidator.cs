using FluentValidation;

namespace Application.Features.AntibioticSpectra.DeleteAntibioticSpectrum;

public class DeleteAntibioticSpectrumValidator : AbstractValidator<DeleteAntibioticSpectrumCommand>
{
    public DeleteAntibioticSpectrumValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Antibiotic spectrum ID is required");
    }
}