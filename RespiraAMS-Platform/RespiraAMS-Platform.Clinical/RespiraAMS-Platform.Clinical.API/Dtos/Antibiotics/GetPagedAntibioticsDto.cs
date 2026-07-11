using Application.Features.Antibiotics.GetPagedAntibiotics;
using Domain.Enums;
using RespiraAMS_Platform.Shared.DTOs;

namespace API.Dtos.Antibiotics;

public class GetPagedAntibioticsDto
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
    /// Query filter: antibiotic name. Case-insensitive
    /// </summary>
    public string? Name { get; set; }
    /// <summary>
    /// Query filter: antibiotic spectrum ID.
    /// </summary>
    public Guid? AntibioticSpectrumId { get; set; }
    /// <summary>
    /// Query filter: Antibiotic category. Case-insensitive
    /// </summary>
    public AwareCategory? Category { get; set; }

    public GetPagedAntibioticsQuery ToQuery()
    {
        return new GetPagedAntibioticsQuery
        {
            Param = new PaginationParam
            {
                Page = Page,
                Size = Size,
            },
            Filter = new AntibioticFilter()
            {
                Name = Name,
                AntibioticSpectrumId = AntibioticSpectrumId,
                Category = Category,
            }
        };
    }
}
