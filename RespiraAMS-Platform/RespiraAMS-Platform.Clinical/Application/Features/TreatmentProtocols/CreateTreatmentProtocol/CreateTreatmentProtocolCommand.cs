using Application.Abstracts.CQRS;
using Domain.Enums;

namespace Application.Features.TreatmentProtocols.CreateTreatmentProtocol;

public class CreateTreatmentProtocolCommand : ICommand
{
    public string Name { get; set; } = string.Empty;
    public string Issuer {get; set; } = string.Empty;
    public DateOnly IssueDate { get; set; }
    public int Version { get; set; }
    public Guid DiseaseId { get; set; }
    public Severity Severity { get; set; }
    public TreatmentSite TreatmentSite { get; set; }
    public Guid? SpecialInfectionId { get; set; }
    public List<Guid> OtherCriteriaIds { get; set; } = [];
    public List<Guid> MedicineIds { get; set; } = [];
}

public class CreateTreatmentProtocolResult(Guid id)
{
    /// <summary>
    /// Created treatment protocol ID
    /// </summary>
    public Guid Id { get; set; } = id;
}