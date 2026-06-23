using Application.Abstracts.CQRS;
using Application.Shared.Dtos;

namespace Application.Features.Diseases.GetDiagnosisTemplate;

public class GetDiagnosisTemplateQuery(Guid id) : IQuery
{
    public Guid Id { get; set; } = id;
}

public class DiagnosisTemplate
{
    /// <summary>
    /// List of ICU hospitalize criteria that associated with this disease
    /// </summary>
    public List<CriterionItem> IcuHospitalizeCriteria { get; set; } = [];
    /// <summary>
    /// List of resistance risk factors that associated with this disease
    /// </summary>
    public List<CriterionItem> ResistanceRiskFactors { get; set; } = [];
    /// <summary>
    /// List of other criteria that associated with this disease
    /// </summary>
    public List<CriterionItem> OtherCriteria { get; set; } = [];
}