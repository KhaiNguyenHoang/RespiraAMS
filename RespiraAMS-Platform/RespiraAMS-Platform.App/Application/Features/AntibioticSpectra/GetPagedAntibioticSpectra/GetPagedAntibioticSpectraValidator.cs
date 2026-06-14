using Application.Shared.Validations;
using FluentValidation;

namespace Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;

public class GetPagedAntibioticSpectrumValidator : AbstractValidator<GetPagedAntibioticSpectraQuery>
{
    public GetPagedAntibioticSpectrumValidator()
    {
        RuleFor(query => query.Param).IsValidPaginationParam();
    }
}