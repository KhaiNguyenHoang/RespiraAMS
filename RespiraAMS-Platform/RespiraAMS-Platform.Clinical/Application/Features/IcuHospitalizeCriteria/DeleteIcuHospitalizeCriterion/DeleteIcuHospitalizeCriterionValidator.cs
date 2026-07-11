using FluentValidation;

namespace Application.Features.IcuHospitalizeCriteria.DeleteIcuHospitalizeCriterion;

public class DeleteIcuHospitalizeCriterionValidation : AbstractValidator<DeleteIcuHospitalizeCriterionCommand>
{
    public DeleteIcuHospitalizeCriterionValidation()
    {
        RuleFor(x => x.Id)
            .NotEmpty()
            .WithMessage("ICU Hospitalize Criterion ID is required");
    }
}