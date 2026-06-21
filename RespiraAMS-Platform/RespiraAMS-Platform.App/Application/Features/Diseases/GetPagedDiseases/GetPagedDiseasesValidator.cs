using FluentValidation;
using RespiraAMS_Platform.Shared.Extensions;

namespace Application.Features.Diseases.GetPagedDiseases;

public class GetPagedDiseasesValidator : AbstractValidator<GetPagedDiseasesQuery>
{
    public GetPagedDiseasesValidator()
    {
        RuleFor(x => x.Param).IsValidPaginationParam();
    }
}