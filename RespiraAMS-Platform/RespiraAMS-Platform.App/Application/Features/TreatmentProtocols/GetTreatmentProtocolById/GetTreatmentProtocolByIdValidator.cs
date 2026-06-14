using FluentValidation;

namespace Application.Features.TreatmentProtocols.GetTreatmentProtocolById;

public class GetTreatmentProtocolByIdValidator : AbstractValidator<GetTreatmentProtocolByIdQuery>
{
    public GetTreatmentProtocolByIdValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Treatment protocol ID is required");
    }
}