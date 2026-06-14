using Application.Shared.Validations;
using FluentValidation;

namespace Application.Features.Pathogens.GetPagedPathogens;

public class GetPagedPathogensValidator : AbstractValidator<GetPagedPathogensQuery>
{
    public GetPagedPathogensValidator()
    {
        RuleFor(x => x.Param).IsValidPaginationParam();
    }
}