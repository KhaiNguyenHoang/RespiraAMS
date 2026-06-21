using Application.Abstracts.CQRS;

namespace Application.Features.Statistics;

/*=== Query DTOs ===*/
public class GetStatisticsQuery : IQuery
{
    public Guid? DoctorId { get; set; }
    public int Month { get; set; } = DateTime.Now.Month;
    public int Year { get; set; } = DateTime.Now.Year;
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