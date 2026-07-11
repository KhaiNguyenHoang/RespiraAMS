using FluentValidation;
using RespiraAMS_Platform.Shared.Extensions;

namespace Application.Features.Pathogens.GetPagedPathogens;

public class GetPagedPathogensValidator : AbstractValidator<GetPagedPathogensQuery>
{
    public GetPagedPathogensValidator()
    {
        RuleFor(x => x.Param).IsValidPaginationParam();
    }
}