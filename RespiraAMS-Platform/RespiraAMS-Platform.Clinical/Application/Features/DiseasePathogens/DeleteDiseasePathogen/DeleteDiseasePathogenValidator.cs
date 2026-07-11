using FluentValidation;

namespace Application.Features.DiseasePathogens.DeleteDiseasePathogen;

public class DeleteDiseasePathogenValidator : AbstractValidator<DeleteDiseasePathogenCommand>
{
    public DeleteDiseasePathogenValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Disease pathogen ID is required");
    }
}