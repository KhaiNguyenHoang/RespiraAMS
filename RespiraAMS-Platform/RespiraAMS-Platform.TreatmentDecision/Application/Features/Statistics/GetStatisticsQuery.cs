using System.ComponentModel;
using Application.Abstracts.CQRS;

namespace Application.Features.Statistics;

/*=== Query DTOs ===*/
public class GetStatisticsQuery : IQuery
{
    public Guid? DoctorId { get; set; }
    public int Month { get; set; } = DateTimeOffset.UtcNow.Month;
    public int Year { get; set; } = DateTimeOffset.UtcNow.Year;
}

/*=== Result DTOs ===*/

public class ClinicalDecision
{
    public string Severity { get; set; } = string.Empty;
    public int Count { get; set; }
}

public class RecommendationAccuracy
{
    public int Month { get; set; }
    [Description("Recommendation accuracy. Its value is in range [0, 1], or -1 if there is no recommendation made in this month")]
    public double Accuracy { get; set; }
}

public class AntibioticConsumptionRate
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Rate { get; set; }
}

public class StatisticsResult
{
    public List<ClinicalDecision> TotalDecision { get; set; } = [];
    public List<RecommendationAccuracy> RecommendationAccuracy { get; set; } = [];
    public List<AntibioticConsumptionRate> AntibioticConsumptionRates { get; set; } = [];
}