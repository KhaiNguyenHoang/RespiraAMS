using Application.Abstracts.CQRS;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.Pathogens.GetPagedPathogens;

/*=== Query DTOs ===*/

public class PathogenFilter
{
    public string? Name { get; set; }
}

public class GetPagedPathogensQuery : IQuery
{
    public PaginationParam Param { get; set; } = null!;
    public PathogenFilter? Filter { get; set; }
}

/*=== Result DTOs ===*/

public class PathogenItem
{
    /// <summary>
    /// Pathogen ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Pathogen name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Pathogen description
    /// </summary>
    public string Description { get; set; } = string.Empty;
}
