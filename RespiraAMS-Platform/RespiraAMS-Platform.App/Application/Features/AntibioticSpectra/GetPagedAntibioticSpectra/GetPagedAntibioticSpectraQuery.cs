using Application.Abstracts.CQRS;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;

public class GetPagedAntibioticSpectraQuery : IQuery
{
    public PaginationParam Param { get; set; } = null!;
}

public class AntibioticSpectrumItem
{
    /// <summary>
    /// Antibiotic spectrum ID
    /// </summary>
    public Guid Id { get; set; }
    /// <summary>
    /// Antibiotic spectrum name
    /// </summary>
    public string Name { get; set; } = string.Empty;
    /// <summary>
    /// Antibiotic spectrum description
    /// </summary>
    public string Description { get; set; } = string.Empty;
}
