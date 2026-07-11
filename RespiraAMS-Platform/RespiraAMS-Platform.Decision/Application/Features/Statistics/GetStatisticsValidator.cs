using FluentValidation;

namespace Application.Features.Statistics;

public class GetStatisticsValidator : AbstractValidator<GetStatisticsQuery>
{
    public GetStatisticsValidator()
    {
        RuleFor(x => x.DoctorId)
            .NotEmpty()
            .WithMessage("DoctorId is required")
            .When(x => x.DoctorId != null);
        RuleFor(x => x.Month)
            .GreaterThan(0)
            .LessThanOrEqualTo(12)
            .WithMessage("Month is required, and must be a valid [1, 12]");
        RuleFor(x => x.Year)
            .GreaterThan(2000)
            .WithMessage("Year is required, and must be a valid year (> 2000)");
    }
}