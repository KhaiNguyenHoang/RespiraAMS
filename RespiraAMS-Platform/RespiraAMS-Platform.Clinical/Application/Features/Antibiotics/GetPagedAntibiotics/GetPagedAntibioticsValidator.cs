using FluentValidation;
using RespiraAMS_Platform.Shared.Extensions;

namespace Application.Features.Antibiotics.GetPagedAntibiotics;

public class GetPagedAntibioticsValidator : AbstractValidator<GetPagedAntibioticsQuery>
{
    public GetPagedAntibioticsValidator()
    {
        RuleFor(x => x.Param).IsValidPaginationParam();
        // Technically, filter doesn't need to be correct, so we won't validate any filter field 
    }
}