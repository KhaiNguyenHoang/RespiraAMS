using FluentValidation;

namespace Application.Features.TreatmentProtocols.DeleteTreatmentProtocol;

public class DeleteTreatmentProtocolValidator : AbstractValidator<DeleteTreatmentProtocolCommand>
{
    public DeleteTreatmentProtocolValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("Treatment protocol ID is required");
    }
}
