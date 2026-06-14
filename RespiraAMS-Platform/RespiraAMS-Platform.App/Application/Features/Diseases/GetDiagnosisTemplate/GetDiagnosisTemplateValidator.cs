using FluentValidation;

namespace Application.Features.Diseases.GetDiagnosisTemplate;

public class GetDiagnosisTemplateValidator : AbstractValidator<GetDiagnosisTemplateQuery>
{
    public GetDiagnosisTemplateValidator()
    {
        RuleFor(x => x.Id).NotEmpty().WithMessage("Disease ID is required.");
    }
}