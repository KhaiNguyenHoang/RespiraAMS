using Application.Abstracts.CQRS;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Diseases.GetPagedDiseases;

public class GetPagedDiseasesQuery : IQuery
{
    public PaginationParam Param { get; set; } = null!;
}

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
    /// <summary>
    /// Disease description
    /// </summary>
    public string Description { get; set; } = string.Empty;
}
