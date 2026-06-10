using Domain.Enums;
using Domain.Exceptions;
using Domain.Models;
using Domain.Services.Abstracts;
using Microsoft.Extensions.Logging;

namespace Domain.Services.Implementations;

public class DiagnoseService(ILogger<DiagnoseService> logger) : IDiagnoseService
{
    public (Severity, TreatmentSite) Curb65(bool confusion, double? urea, int respiratory, int systolic, int diastolic, int age)
    {
        var score = 0;
        if (confusion) score++;
        if (urea > 7) score++;
        if (respiratory >= 30) score++;
        if (systolic < 90 || diastolic < 60) score++;
        if (age >= 65) score++;

        if (urea is null)
        {
            return score switch
            {
                0 => (Severity.Mild, TreatmentSite.Outpatient),
                1 or 2 => (Severity.Moderate, TreatmentSite.Inpatient),
                3 or 4 => (Severity.Severe, TreatmentSite.IntensiveCareUnit),
                _ => throw new UnexpectedException($"CRB65 score get an unexpected value: {score}")
            };
        }
        
        return score switch
        {
            >= 0 and <= 1 => (Severity.Mild, TreatmentSite.Outpatient),
            2 => (Severity.Moderate, TreatmentSite.Inpatient),
            >= 3 and <= 5 => (Severity.Severe, TreatmentSite.IntensiveCareUnit),
            _ => throw new UnexpectedException($"CURB65 score get an unexpected value: {score}")
        };
    }

    public bool NeedIcu(List<IcuHospitalizeCriterion> criteria, int mainThreshold, int secondaryThreshold, List<Guid> options)
    {
        var (mainScore, secondaryScore) = (0, 0);
        foreach (var option in options)
        {
            var criterion = criteria.FirstOrDefault(x => x.CriterionId == option);
            if (criterion is null)
            {
                logger.LogWarning("Clinical picture ICU hospitalize criterion not found: {CriterionId}", option);
                throw new BadRequestException("Clinical picture ICU hospitalize criterion not found");
            }
    
            if (criterion.IsMainCriteria)
            {
                mainScore++;
            }
            else
            {
                secondaryScore++;
            }
        }
    
        return mainScore >= mainThreshold || secondaryScore >= secondaryThreshold;
    }

    public Dictionary<Pathogen, double> AssessInfectionProbability(List<ResistanceRiskFactor> factors, List<Guid> options)
    {
        var scores = new Dictionary<Guid, int>();
        foreach (var option in options)
        {
            var factor = factors.FirstOrDefault(x => x.CriterionId == option);
            if (factor is null)
            {
                logger.LogWarning("Resistance risk factor not found: {CriterionId}", option);
                throw new BadRequestException("Resistance risk factor not found");
            }

            if (scores.TryGetValue(factor.PathogenId, out _))
            {
                scores[factor.PathogenId]++;
            }
            else
            {
                scores.Add(factor.PathogenId, 1);
            }
        }

        var probabilities = new Dictionary<Pathogen, double>();
        var factorsByPathogen = factors.GroupBy(x => x.Pathogen);
        foreach (var factor in factorsByPathogen)
        {
            var key = factor.Key;
            if (!scores.TryGetValue(factor.Key.Id, out _)) continue;
            var value = (double)scores[factor.Key.Id] / factor.Count();
            probabilities.Add(key, value);
        }

        return probabilities;
    }
}