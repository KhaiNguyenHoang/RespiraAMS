using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Enums;
using Domain.Models;
using Domain.Services.Abstracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Diagnose;

public class DiagnoseHandler(IDbContext context, IDiagnoseService service, ILogger<DiagnoseHandler> logger)
    : IQueryHandler<DiagnoseQuery, DiagnoseResult>
{
    /*
     * Flow:
     * 1. First, assess the severity and decide treatment site using CURB-65 and AST. There are 2 cases:
     * 1.1. Treatment site return by CURB-65 match AST (patient need ICU)
     * 1.2. Treatment site return by CURB-65 not match AST
     * - CURB-65 -> need ICU but AST -> don't need ICU, or
     * - CURB-65 -> don't need ICU but AST -> need ICU
     * In that case, we will prioritize a more severe treatment site (ICU > Inpatient > Outpatient)
     * 2. Assess the infection probability: the more factors that patient had -> the higher the probability
     * We'll treat that, patient that had all the factors of a pathogen is "almost" certainly infect with it
     * (~100%), probability = patient had / total
     * 3. We will filter all treatment protocols that have neither severity nor treatment site matched
     * 4. Next, we will sort the protocols with this priority:
     * 4.1. Protocols that has both severity and treatment site matched
     * 4.2. Protocols that made to deal with a special infection, sorted by probability of having that infection
     * 4.3. Protocols that had secondary criteria that match with patient clinical picture (the more matched, the
     * higher priority)
     * 4.4. Sort by version and issue date
     */

    public async Task<DiagnoseResult> HandleAsync(DiagnoseQuery query)
    {
        // Get disease by ID
        var disease = await context.Diseases
            .AsSplitQuery()
            .Include(x => x.IcuHospitalizeCriteria)
            .ThenInclude(x => x.Criterion)
            .Include(x => x.ResistanceRisks)
            .ThenInclude(x => x.Criterion)
            .Include(x => x.ResistanceRisks)
            .ThenInclude(x => x.Pathogen)
            .Include(x => x.TreatmentProtocols)
            .ThenInclude(x => x.SpecialInfection)
            .Include(x => x.TreatmentProtocols)
            .ThenInclude(x => x.OtherCriteria)
            .Include(x => x.TreatmentProtocols)
            .ThenInclude(x => x.Medicines)
            .ThenInclude(x => x.AntibioticSpectrum)
            .FirstOrDefaultAsync(x => x.Id == query.DiseaseId);

        if (disease is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), query.DiseaseId);
        }

        // Validation: check if all the provided criteria IDs exist
        if (!query.IcuHospitalizeCriteria.All(x =>
                disease.IcuHospitalizeCriteria.Select(icu => icu.CriterionId).Contains(x)))
        {
            logger.LogWarning("Not all ICU hospitalize criteria ID exist");
            throw new BadRequestException("Not all ICU hospitalize criteria ID exist");
        }

        if (!query.ResistanceRiskFactors.All(x =>
                disease.ResistanceRisks.Select(risk => risk.CriterionId).Contains(x)))
        {
            logger.LogWarning("Not all resistance risk factors ID exist");
            throw new BadRequestException("Not all resistance risk factors ID exist");
        }

        if (await context.Criteria.CountAsync(x => query.OtherCriteria.Contains(x.Id)) !=
            query.OtherCriteria.Count)
        {
            logger.LogWarning("Not all other criteria IDs exists");
            throw new BadRequestException("Not all other criteria IDs exists");
        }

        // Assess severity and treatment site using CURB-65 metrics
        var (severity, treatmentSite) = service.Curb65(query.Confusion, query.Urea, query.Respiratory,
            query.Systolic, query.Diastolic, query.Age);

        // Assess if patient need ICU
        if (service.NeedIcu(disease.IcuHospitalizeCriteria, disease.RequiredIcuMainCriteria,
                disease.RequiredIcuSecondaryCriteria, query.IcuHospitalizeCriteria))
        {
            // Here, we will prioritize the AST criteria for ICU hospitalization than CURB-65
            treatmentSite = TreatmentSite.IntensiveCareUnit;
        }

        // Get infection probability
        var probabilities = service
            .AssessInfectionProbability(disease.ResistanceRisks, query.ResistanceRiskFactors);

        // Get treatment protocols by severity and treatment site
        var protocols = disease.TreatmentProtocols
            .Where(x => x.Severity == severity || x.TreatmentSite == treatmentSite)
            .ToList();

        // Sort protocols
        var probs = probabilities
            .ToDictionary(x => x.Key.Id, x => x.Value);
        var sorted = protocols
            .OrderByDescending(p => p.Severity == severity && p.TreatmentSite == treatmentSite ? 1 : 0)
            .ThenByDescending(p =>
                p.SpecialInfectionId is not null ? probs.GetValueOrDefault(p.SpecialInfectionId.Value, 0d) : 0d)
            .ThenByDescending(p => p.OtherCriteria.Count(c => query.OtherCriteria.Contains(c.Id)))
            .ThenByDescending(p => p.Version)
            .ThenByDescending(p => p.IssueDate);
        
        return new DiagnoseResult()
        {
            Severity = severity,
            TreatmentSite = treatmentSite,
            InfectionProbabilities = probabilities.Select(x => new InfectionProbability()
            {
                PathogenId = x.Key.Id,
                PathogenName = x.Key.Name,
                Probability = x.Value
            }).ToList(),
            Recommend = sorted.Select(x => new TreatmentProtocolItem()
            {
                Id = x.Id,
                Name = x.Name,
                Issuer = x.Issuer,
                IssueDate = x.IssueDate,
                Version = x.Version,
                Medicines = x.Medicines.Select(y => new AntibioticItem()
                {
                    Id = y.Id,
                    Name = y.Name,
                    Category = y.Category,
                    AntibioticSpectrum = new AntibioticSpectrumItem()
                    {
                        Id = y.AntibioticSpectrum.Id,
                        Name = y.AntibioticSpectrum.Name,
                    },
                    Dosages = y.Dosages,
                    RouteOfAdministrations = y.Dosages.Keys.AsEnumerable().ToList()
                }).ToList()
            }).ToList(),
        };
    }
}