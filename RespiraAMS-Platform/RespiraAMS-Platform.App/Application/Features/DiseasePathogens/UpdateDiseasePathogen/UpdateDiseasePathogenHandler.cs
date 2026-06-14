using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.Extensions.Logging;

namespace Application.Features.DiseasePathogens.UpdateDiseasePathogen;

public class UpdateDiseasePathogenHandler(
    IDbContext context,
    IUpdateMapper<DiseasePathogen, UpdateDiseasePathogenCommand> mapper,
    ILogger<UpdateDiseasePathogenHandler> logger)
    : ICommandHandler<UpdateDiseasePathogenCommand>
{
    public async Task HandleAsync(UpdateDiseasePathogenCommand command)
    {
        // Validate FKs
        if (await context.Pathogens.FindAsync(command.PathogenId) is null)
        {
            logger.LogWarning("Pathogen ID not found");
            throw new NotFoundException(nameof(Pathogen), command.PathogenId);
        }
        
        // Get entity by ID
        var diseasePathogen = await context.DiseasePathogens.FindAsync(command.Id);
        if (diseasePathogen is null)
        {
            logger.LogWarning("Disease pathogen ID not found");
            throw new NotFoundException(nameof(DiseasePathogen), command.Id);
        }

        // Map from command to entity
        mapper.MapModel(diseasePathogen, command);

        // Save changes to database
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to update disease pathogen");
            throw new InternalServerErrorException();
        }
    }
}