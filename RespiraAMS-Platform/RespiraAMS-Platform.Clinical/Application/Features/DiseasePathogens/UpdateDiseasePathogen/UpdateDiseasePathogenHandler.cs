using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.DiseasePathogens.UpdateDiseasePathogen;

public class UpdateDiseasePathogenHandler(
    IDbContext context,
    IUpdateMapper<DiseasePathogen, UpdateDiseasePathogenCommand> mapper,
    ILogger<UpdateDiseasePathogenHandler> logger)
    : ICommandHandler<UpdateDiseasePathogenCommand>
{
    public async Task HandleAsync(UpdateDiseasePathogenCommand command, CancellationToken cancellationToken = default)
    {
        // Get entity by ID
        var diseasePathogen = await context.DiseasePathogens
            .FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (diseasePathogen is null)
        {
            logger.LogWarning("Disease pathogen ID not found");
            throw new NotFoundException(nameof(DiseasePathogen), command.Id);
        }

        // Map from command to entity
        mapper.MapModel(diseasePathogen, command);

        // Save changes to database
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to update disease pathogen");
            throw new InternalServerErrorException();
        }
    }
}