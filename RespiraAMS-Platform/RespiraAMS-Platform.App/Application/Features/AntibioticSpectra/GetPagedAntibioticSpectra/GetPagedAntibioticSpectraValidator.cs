using FluentValidation;
using RespiraAMS_Platform.Shared.Extensions;

namespace Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;

public class GetPagedAntibioticSpectrumValidator : AbstractValidator<GetPagedAntibioticSpectraQuery>
{
    public GetPagedAntibioticSpectrumValidator()
    {
        RuleFor(query => query.Param).IsValidPaginationParam();
    }
}