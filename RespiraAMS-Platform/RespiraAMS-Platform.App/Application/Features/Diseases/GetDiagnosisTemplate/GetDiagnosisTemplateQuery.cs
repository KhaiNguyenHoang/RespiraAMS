using Application.Abstracts.CQRS;
using Application.Shared.Dtos;

namespace Application.Features.Diseases.GetDiagnosisTemplate;

public class GetDiagnosisTemplateQuery(Guid id) : IQuery
{
    public Guid Id { get; set; } = id;
}

public class DiagnosisTemplate
{
    public List<CriterionItem> IcuHospitalizeCriteria { get; set; } = [];
    public List<CriterionItem> ResistanceRiskFactors { get; set; } = [];
    public List<CriterionItem> OtherCriteria { get; set; } = [];
}