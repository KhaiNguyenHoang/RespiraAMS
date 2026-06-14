using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.TreatmentProtocols.GetTreatmentProtocolById;

public class GetTreatmentProtocolByIdHandler(
    IDbContext context,
    IResultMapper<Criterion, CriterionItem> criterionMapper)
    : IQueryHandler<GetTreatmentProtocolByIdQuery, TreatmentProtocolResult>
{
    public async Task<TreatmentProtocolResult> HandleAsync(GetTreatmentProtocolByIdQuery query)
    {
        var protocol = await context.TreatmentProtocols
            .AsSplitQuery()
            .Where(x => x.Id == query.Id)
            .Select(x => new TreatmentProtocolResult()
            {
                Id = x.Id,
                UpdatedAt = x.UpdatedAt,
                Name = x.Name,
                Issuer = x.Issuer,
                IssueDate = x.IssueDate,
                Version = x.Version,
                Severity = x.Severity,
                TreatmentSite = x.TreatmentSite,
                SpecialInfection = x.SpecialInfection == null
                    ? null
                    : new PathogenItem()
                    {
                        Id = x.SpecialInfection.Id,
                        Name = x.SpecialInfection.Name,
                        Description = x.SpecialInfection.Description,
                    },
                // Do NOT convert this lambda expression into a method group, EF Core cannot execute it
                OtherCriteria = x.OtherCriteria.Select(y => criterionMapper.ToResult(y)).ToList(),
                Medicines = x.Medicines.Select(y => new AntibioticItem()
                {
                    Id = y.Id,
                    Name = y.Name,
                    AntibioticSpectrum = new AntibioticSpectrumItem()
                    {
                        Id = y.AntibioticSpectrum.Id,
                        Name = y.AntibioticSpectrum.Name,
                        Description = y.AntibioticSpectrum.Description,
                    },
                    Category = y.Category,
                    Dosages = y.Dosages,
                }).ToList(),
            })
            .FirstOrDefaultAsync();

        if (protocol is null)
        {
            throw new NotFoundException(nameof(TreatmentProtocol), query.Id);
        }

        // Extract the route of administrations from dosages
        foreach (var medicine in protocol.Medicines)
        {
            medicine.RouteOfAdministrations = medicine.Dosages.Keys.ToList();
        }

        return protocol;
    }
}