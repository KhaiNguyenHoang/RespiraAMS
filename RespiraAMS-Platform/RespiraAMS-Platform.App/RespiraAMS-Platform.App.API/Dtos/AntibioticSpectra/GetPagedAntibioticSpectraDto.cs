using Application.Features.AntibioticSpectra.GetPagedAntibioticSpectra;
using RespiraAMS_Platform.Shared.DTOs;

namespace API.Dtos.AntibioticSpectra;

public class GetPagedAntibioticSpectraDto
{
    /// <summary>
    /// Page index. Must be a positive integer
    /// </summary>
    public int Page { get; set; } = 1;
    /// <summary>
    /// Page size. Must be a positive integer and less than or equal to 100
    /// </summary>
    public int Size { get; set; } = 10;

    public GetPagedAntibioticSpectraQuery ToQuery()
    {
        return new GetPagedAntibioticSpectraQuery
        {
            Param = new PaginationParam
            {
                Page = Page,
                Size = Size
            }
        };
    }
}
