using FluentValidation;

namespace Application.Features.Diseases.DeleteDisease;

public class DeleteDiseaseValidator : AbstractValidator<DeleteDiseaseCommand>
{
    public DeleteDiseaseValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Disease ID is required");
    }
}