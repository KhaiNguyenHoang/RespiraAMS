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

/// <summary>
/// Clinical decision made in a timeframe, by severity
/// </summary>
public class ClinicalDecision
{
    /// <summary>
    /// Disease severity  
    /// </summary>
    public string Severity { get; set; } = string.Empty;
    /// <summary>
    /// Total decision made
    /// </summary>
    public int Count { get; set; }
}

/// <summary>
/// Recommendation accuracy over in a month
/// </summary>
public class RecommendationAccuracy
{
    /// <summary>
    /// The analyzing month
    /// </summary>
    public int Month { get; set; }
    /// <summary>
    /// Recommendation accuracy. Its value can either be in range [0, 1], or -1 if there is no recomendation made
    /// in this month
    /// </summary>
    public double Accuracy { get; set; }
}

/// <summary>
/// Antibiotic consumption rate group by AWaRe category, over a timeframe
/// </summary>
public class AntibioticConsumptionRate
{
    /// <summary>
    /// AWaRe category
    /// </summary>
    public string Category { get; set; } = string.Empty;
    /// <summary>
    /// Total medicine appearance in all decisions 
    /// </summary>
    public int Count { get; set; }
    /// <summary>
    /// Consumption rate, in range [0, 1]
    /// </summary>
    public double Rate { get; set; }
}

public class StatisticsResult
{
    /// <summary>
    /// Total decisions made over a year
    /// </summary>
    public List<ClinicalDecision> TotalDecision { get; set; } = [];
    /// <summary>
    /// Recommendation accuracy in a month
    /// </summary>
    public List<RecommendationAccuracy> RecommendationAccuracy { get; set; } = [];
    /// <summary>
    /// Antibiotic consumption rates over a month
    /// </summary>
    public List<AntibioticConsumptionRate> AntibioticConsumptionRates { get; set; } = [];
}