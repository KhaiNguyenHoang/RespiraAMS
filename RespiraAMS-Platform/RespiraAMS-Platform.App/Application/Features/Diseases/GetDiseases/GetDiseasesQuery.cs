using Application.Abstracts.CQRS;

namespace Application.Features.Diseases.GetDiseases;

public class GetDiseasesQuery : IQuery;

public class DiseaseItem
{
    /// <summary>
    /// Disease ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Disease name
    /// </summary>
    public string Name { get; set; } = string.Empty;
}