using Application.Abstracts.CQRS;
using Application.Shared.Dtos;
using Domain.Enums;

namespace Application.Features.Diseases.GetDiseaseById;

/*=== Query DTOs ===*/

public class GetDiseaseByIdQuery(Guid id) : IQuery
{
    public Guid Id { get; set; } = id;
}

/*=== Result DTOs ===*/

public class IcuHospitalizeCriterionItem
{
    /// <summary>
    /// ICU hospitalize criterion ID
    /// </summary>
    public Guid Id { get; set; } 
    /// <summary>
    /// Criterion
    /// </summary>
    public CriterionItem Criterion { get; set; } = null!;
    /// <summary>
    /// Is this criterion main or secondary criterion
    /// </summary>
    public bool IsMainCriteria { get; set; }
}

public class DiseasePathogenItem
{
    /// <summary>
    /// Disease pathogen ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Pathogen
    /// </summary>
    public string Pathogen { get; set; } = null!;
    /// <summary>
    /// The severity associated with this pathogen for the current disease
    /// </summary>
    public Severity Severity { get; set; }
    /// <summary>
    /// The treatment site associated with this pathogen for the current disease
    /// </summary>
    public TreatmentSite TreatmentSite { get; set; }
}

public class ResistanceRiskFactorItem
{
    /// <summary>
    /// Resistance risk factor ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// The pathogen associated with this risk factor
    /// </summary>
    public string Pathogen { get; set; } = null!;
    /// <summary>
    /// Criterion for this risk factor
    /// </summary>
    public CriterionItem Criterion { get; set; } = null!;
    /// <summary>
    /// Resistance risk factor name
    /// </summary>
    public string Name { get; set; } = string.Empty;
}

public class TreatmentProtocolItem
{
    /// <summary>
    /// Treatment protocol ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Treatment protocol updated timestamp (UTC+0)
    /// </summary>
    public DateTimeOffset UpdatedAt { get; set; }
    /// <summary>
    /// Treatment protocol name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issuer
    /// </summary>
    public string Issuer { get; set; } = string.Empty;
    /// <summary>
    /// Treatment protocol issue date
    /// </summary>
    public DateOnly IssueDate { get; set; }
    /// <summary>
    /// Treatment protocol version
    /// </summary>
    public int Version { get; set; }
}

public class DiseaseResult
{
    /// <summary>
    ///  Disease ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Disease name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Disease description
    /// </summary>
    public string Description { get; set; } = string.Empty;
    /// <summary>
    /// Disease minimum required number of main criteria for ICU hospitalization 
    /// </summary>
    public int RequiredIcuMainCriteria { get; set; }
    /// <summary>
    /// Disease minimum required number of secondary criteria for ICU hospitalization 
    /// </summary>
    public int RequiredIcuSecondaryCriteria { get; set; }
    /// <summary>
    /// Disease's ICU hospitalize criteria
    /// </summary>
    public List<IcuHospitalizeCriterionItem> IcuHospitalizeCriteria { get; init; } = [];
    /// <summary>
    /// Disease's resistance risk factors
    /// </summary>
    public List<ResistanceRiskFactorItem> ResistanceRisks { get; init; } = [];
    /// <summary>
    /// Disease's causes
    /// </summary>
    public List<DiseasePathogenItem> DiseasePathogens {get; init;} = [];
    /// <summary>
    /// Disease's treatment protocols
    /// </summary>
    public List<TreatmentProtocolItem> TreatmentProtocols { get; init; } = [];
}