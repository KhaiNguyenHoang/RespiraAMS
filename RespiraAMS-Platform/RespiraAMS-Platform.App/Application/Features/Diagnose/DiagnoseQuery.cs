using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.Diagnose;

/*=== Query DTOs ===*/

public class DiagnoseQuery : IQuery
{
    public Guid DiseaseId { get; set; }
    public bool Confusion { get; set; }
    public double? Urea { get; set; }
    public int Respiratory { get; set; }
    public int Systolic { get; set; }
    public int Diastolic { get; set; }
    public int Age { get; set; }
    public List<Guid> IcuHospitalizeCriteria { get; set; } = [];
    public List<Guid> ResistanceRiskFactors { get; set; } = [];
    public List<Guid> OtherCriteria { get; set; } = [];
}

/* === Result DTOs === */

public class InfectionProbability
{
    public Guid PathogenId { get; set; }
    public string PathogenName { get; set; } = string.Empty;
    public double Probability { get; set; }
}

public class AntibioticSpectrumItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class AntibioticItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public AntibioticSpectrumItem AntibioticSpectrum { get; set; } = null!;
    public AwareCategory Category { get; set; }
    public List<RouteOfAdministration> RouteOfAdministrations { get; set; } = [];
    public Dictionary<RouteOfAdministration, List<string>> Dosages { get; set; } = [];
}

public class TreatmentProtocolItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Issuer {get; set; } = string.Empty;
    public DateOnly IssueDate { get; set; }
    public int Version { get; set; }
    public List<AntibioticItem> Medicines { get; set; } = [];
}

public class DiagnoseResult
{
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
    public List<InfectionProbability> InfectionProbabilities { get; set; } = [];
    public List<TreatmentProtocolItem> Recommend { get; set; } = [];
}