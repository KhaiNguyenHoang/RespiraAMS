using Application.Abstracts.CQRS;

namespace Application.Features.Pathogens.GetPathogens;

public class GetPathogensQuery : IQuery;

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
}