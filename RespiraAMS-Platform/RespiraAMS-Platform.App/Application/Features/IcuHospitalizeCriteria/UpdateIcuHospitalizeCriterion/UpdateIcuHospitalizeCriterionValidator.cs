using Application.Shared.Validations;
using FluentValidation;

namespace Application.Features.IcuHospitalizeCriteria.UpdateIcuHospitalizeCriterion;

public class UpdateIcuHospitalizeCriterionValidation : AbstractValidator<UpdateIcuHospitalizeCriterionCommand>
{
    public UpdateIcuHospitalizeCriterionValidation()
    {
        RuleFor(x => x.Criterion)
            .SetValidator(new UpdateCriterionValidator());
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("ICU Hospitalize Criterion ID is required");
    }
}
