using FluentValidation;
using RespiraAMS_Platform.Shared.Extensions;

namespace Application.Features.TreatmentDecisions.GetPagedTreatmentDecisions;

public class GetPagedTreatmentDecisionValidator : AbstractValidator<GetPagedTreatmentDecisionsQuery>
{
    public GetPagedTreatmentDecisionValidator()
    {
        RuleFor(x => x.DoctorId)
            .NotEmpty()
            .WithMessage("Doctor ID must not be empty");
        RuleFor(x => x.Params)
            .IsValidPaginationParam();
    }
}