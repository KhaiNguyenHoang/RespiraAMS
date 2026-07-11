using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Marten;
using Microsoft.Extensions.Logging;

namespace Application.Features.Statistics;

public class GetStatisticsHandler(IDbContext context, ILogger<GetStatisticsHandler> logger)
    : IQueryHandler<GetStatisticsQuery, StatisticsResult>
{
    public async Task<StatisticsResult> HandleAsync(GetStatisticsQuery query, CancellationToken cancellationToken = default)
    {
        /*
         * Calculate:
         * 1. Entire system:
         * 1.1. Total decision make in a month (group by severity)
         * 1.2. Recommendation system accuracy rate (number of case where system recommendation protocol
         * match what doctor chosen). It should return a series group by month, in a year
         * 1.3. Medicine consumption rate by category (group by Chosen.Medicine.Category) in a month
         * 2. Per doctor: same metrics as above, but for a single doctor (filter by DoctorId)
         */

        // Query all yearly data
        var yearlyData = context.AsQueryable<Analytic>()
            .Where(x => x.Year == query.Year);

        // Filter by doctor ID if provided
        if (query.DoctorId is not null)
        {
            yearlyData = yearlyData.Where(x => x.DoctorId == query.DoctorId);
        }

        if (!await yearlyData.AnyAsync(cancellationToken))
        {
            logger.LogInformation("No analytics found for {year}", query.Year);
            return new StatisticsResult();
        }

        // Get total decisions make in a month
        var decisions = await yearlyData
            .Where(x => x.Month == query.Month)
            .GroupBy(x => x.Severity)
            .Select(x => new ClinicalDecision()
            {
                Severity = x.Key,
                Count = x.Count(),
            })
            .ToListAsync(cancellationToken);

        // Get recommendation accuracy rate
        // Because Marten has limited support for LINQ, we need to prefetch minimal data first
        // and perform aggregation in memory
        var accuracy = (await yearlyData.Select(x => new
            {
                x.Month,
                x.IsChosenMatchRecommendation
            }).ToListAsync(cancellationToken))
            .GroupBy(x => x.Month)
            .Select(g => new RecommendationAccuracy()
            {
                Month = g.Key,
                Accuracy = !g.Any() ? -1 : (double)g.Count(x => x.IsChosenMatchRecommendation) / g.Count()
            })
            .ToList();

        // Get antibiotic consumption rate by category
        var medicines = await yearlyData
            .Where(x => x.Month == query.Month)
            .SelectMany(x => x.MedicineCategories)
            .ToListAsync(cancellationToken);
        var consumptionRate = medicines
            .GroupBy(x => x)
            .Select(g => new AntibioticConsumptionRate()
            {
                Category = g.Key,
                Count = g.Count(),
                Rate = !medicines.Any() ? -1 : (double)g.Count() / medicines.Count
            })
            .ToList();

        return new StatisticsResult()
        {
            TotalDecision = decisions.ToList(),
            RecommendationAccuracy = accuracy.ToList(),
            AntibioticConsumptionRates = consumptionRate
        };
    }
}