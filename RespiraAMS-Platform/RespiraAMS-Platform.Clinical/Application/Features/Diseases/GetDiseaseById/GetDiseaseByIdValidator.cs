using FluentValidation;

namespace Application.Features.Diseases.GetDiseaseById;

public class GetDiseaseByIdValidator : AbstractValidator<GetDiseaseByIdQuery>
{
    public GetDiseaseByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Disease ID is required");
    }
}