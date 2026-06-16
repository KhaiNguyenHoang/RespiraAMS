using Application.Abstracts.CQRS;
using RespiraAMS_Platform.Shared.DTOs;

namespace Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;

public class GetPagedAntibioticSpectraQuery : IQuery
{
    public PaginationParam Param { get; set; } = null!;
}

public class AntibioticSpectrumItem
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
