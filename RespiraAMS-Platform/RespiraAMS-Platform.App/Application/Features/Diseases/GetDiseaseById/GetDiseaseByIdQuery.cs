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
    public Guid Id { get; set; } 
    public CriterionItem Criterion { get; set; } = null!;
    public bool IsMainCriteria { get; set; }
}

public class DiseasePathogenItem
{
    public Guid Id { get; set; }
    public string Pathogen { get; set; } = null!;
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
}

public class ResistanceRiskFactorItem
{
    public Guid Id { get; set; }
    public string Pathogen { get; set; } = null!;
    public CriterionItem Criterion { get; set; } = null!;
    public string Name { get; set; } = string.Empty;
}

public class TreatmentProtocolItem
{
    public Guid Id { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public DateOnly IssueDate { get; set; }
    public int Version { get; set; }
}

public class DiseaseResult
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int RequiredIcuMainCriteria { get; set; }
    public int RequiredIcuSecondaryCriteria { get; set; }
    public List<IcuHospitalizeCriterionItem> IcuHospitalizeCriteria { get; init; } = [];
    public List<ResistanceRiskFactorItem> ResistanceRisks { get; init; } = [];
    public List<DiseasePathogenItem> DiseasePathogens {get; init;} = [];
    public List<TreatmentProtocolItem> TreatmentProtocols { get; init; } = [];
}