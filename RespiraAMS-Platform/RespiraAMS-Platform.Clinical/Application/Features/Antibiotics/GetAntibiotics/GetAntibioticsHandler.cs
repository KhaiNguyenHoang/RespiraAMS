using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Antibiotics.GetAntibiotics;

public class GetAntibioticsHandler(IDbContext context) : IQueryHandler<GetAntibioticsQuery, IEnumerable<AntibioticItem>>
{
    public async Task<IEnumerable<AntibioticItem>> HandleAsync(GetAntibioticsQuery query, CancellationToken cancellationToken = default)
    {
        var antibiotics = await context.Antibiotics
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new AntibioticItem()
            {
                Id = x.Id,
                Name = x.Name,
            })
            .ToListAsync(cancellationToken);
        return antibiotics;
    }
}