using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.DTOs;
using X.PagedList.EF;

namespace Application.Features.Antibiotics.GetPagedAntibiotics;

public class GetPagedAntibioticsHandler(IDbContext context, IPaginationFactory factory)
    : IQueryHandler<GetPagedAntibioticsQuery, Pagination<AntibioticItem>>
{
    public async Task<Pagination<AntibioticItem>> HandleAsync(GetPagedAntibioticsQuery query,
        CancellationToken cancellationToken = default)
    {
        // Construct filter
        var queryable = context.Antibiotics.AsQueryable();
        if (query.Filter is not null)
        {
            // Search by name (contains, case-insensitive)
            if (query.Filter.Name is not null)
            {
                queryable = queryable.Where(x => EF.Functions.ILike(x.Name, $"%{query.Filter.Name}%"));
            }

            // Filter by spectrum
            if (query.Filter.AntibioticSpectrumId is not null)
            {
                queryable = queryable.Where(x => x.AntibioticSpectrumId == query.Filter.AntibioticSpectrumId);
            }

            // Filter by category
            if (query.Filter.Category is not null)
            {
                queryable = queryable.Where(x => x.Category == query.Filter.Category);
            }
        }

        // Query antibiotics
        var antibiotics = await queryable
            .OrderByDescending(x => x.CreatedAt)
            // .Include(x => x.AntibioticSpectrum)
            .Select(x => new AntibioticItem()
            {
                Id = x.Id,
                Name = x.Name,
                AntibioticSpectrum = new AntibioticSpectrumItem()
                {
                    Id = x.AntibioticSpectrum.Id,
                    Name = x.AntibioticSpectrum.Name,
                    Description = x.AntibioticSpectrum.Description,
                },
                Category = x.Category,
                Dosages = x.Dosages,
            })
            .ToPagedListAsync(query.Param.Page, query.Param.Size);

        // Extract the route of administrations from dosages
        foreach (var antibiotic in antibiotics)
        {
            antibiotic.RouteOfAdministrations = antibiotic.Dosages.Keys.ToList();
        }

        return factory.Create(antibiotics);
    }
}