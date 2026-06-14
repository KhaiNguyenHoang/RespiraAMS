using Application.Shared.Validations;
using FluentValidation;

namespace Application.Features.Diseases.GetPagedDiseases;

public class GetPagedDiseasesValidator : AbstractValidator<GetPagedDiseasesQuery>
{
    public GetPagedDiseasesValidator()
    {
        RuleFor(x => x.Param).IsValidPaginationParam();
    }
}