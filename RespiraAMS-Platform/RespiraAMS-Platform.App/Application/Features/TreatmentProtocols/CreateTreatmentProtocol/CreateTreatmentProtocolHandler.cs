using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.TreatmentProtocols.CreateTreatmentProtocol;

public class CreateTreatmentProtocolHandler(
    IDbContext context,
    ICreateMapper<TreatmentProtocol, CreateTreatmentProtocolCommand> mapper,
    ILogger<CreateTreatmentProtocolHandler> logger)
    : ICommandHandler<CreateTreatmentProtocolCommand, CreateTreatmentProtocolResult>
{
    public async Task<CreateTreatmentProtocolResult> HandleAsync(CreateTreatmentProtocolCommand command, CancellationToken cancellationToken = default)
    {
        // Validate FKs
        var disease = await context.Diseases
            .FirstOrDefaultAsync(x => x.Id == command.DiseaseId, cancellationToken);
        if (disease is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), command.DiseaseId);
        }

        if (command.SpecialInfectionId is not null && await context.Pathogens.FirstOrDefaultAsync(x => x.Id == command.SpecialInfectionId, cancellationToken) is null)
        {
            logger.LogWarning("Special Infection ID (Pathogen ID) not found");
            throw new NotFoundException(nameof(Pathogen), command.SpecialInfectionId.Value);
        }

        if (await context.Criteria.CountAsync(x => command.OtherCriteriaIds.Contains(x.Id), cancellationToken) != command.OtherCriteriaIds.Count)
        {
            logger.LogWarning("Not all criterion ids exists");
            throw new BadRequestException("Not all criterion ids exists");
        }

        if (await context.Antibiotics.CountAsync(x => command.MedicineIds.Contains(x.Id), cancellationToken) != command.MedicineIds.Count)
        {
            logger.LogWarning("Not all antibiotic ids exists");
            throw new BadRequestException("Not all medicine ids exists");
        }

        // Map from command to entity
        var protocol = mapper.ToModel(command);
        
        // Add stub to the IDs list
        context.UpdateRelations(protocol.Medicines, command.MedicineIds);
        context.UpdateRelations(protocol.OtherCriteria, command.OtherCriteriaIds);

        // Save changes to database
        await context.TreatmentProtocols.AddAsync(protocol, cancellationToken);
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to create treatment protocol");
            throw new InternalServerErrorException();
        }

        return new CreateTreatmentProtocolResult(protocol.Id);
    }
}