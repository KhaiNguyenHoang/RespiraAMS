using Application.Features.Pathogens.GetPagedPathogens;
using RespiraAMS_Platform.Shared.DTOs;

namespace API.Dtos.Pathogens;

public class GetPagedPathogensDto
{
    /// <summary>
    /// Page index. Must be a positive integer
    /// </summary>
    public int Page { get; set; } = 1;
    /// <summary>
    /// Page size. Must be a positive integer and less than or equal to 100
    /// </summary>
    public int Size { get; set; } = 10;
    /// <summary>
    /// Query filter: pathogen name (case-insensitive)
    /// </summary>
    public string? Name { get; set; }

    public GetPagedPathogensQuery ToQuery()
    {
        return new GetPagedPathogensQuery
        {
            Param = new PaginationParam
            {
                Page = Page,
                Size = Size
            },
            Filter = new PathogenFilter
            {
                Name = Name
            }
        };
    }
}
