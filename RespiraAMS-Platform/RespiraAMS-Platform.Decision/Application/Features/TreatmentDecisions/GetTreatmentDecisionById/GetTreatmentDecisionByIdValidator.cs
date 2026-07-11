using FluentValidation;

namespace Application.Features.TreatmentDecisions.GetTreatmentDecisionById;

public class GetTreatmentDecisionByIdValidator : AbstractValidator<GetTreatmentDecisionByIdQuery>
{
    public GetTreatmentDecisionByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("ID must not be empty");
    }
}