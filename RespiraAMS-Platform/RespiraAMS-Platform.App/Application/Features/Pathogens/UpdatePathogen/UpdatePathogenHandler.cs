using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Pathogens.UpdatePathogen;

public class UpdatePathogenHandler(
    IDbContext context,
    IUpdateMapper<Pathogen, UpdatePathogenCommand> mapper,
    ILogger<UpdatePathogenHandler> logger)
    : ICommandHandler<UpdatePathogenCommand>
{
    public async Task HandleAsync(UpdatePathogenCommand command)
    {
        // Get pathogen by ID
        var pathogen = await context.Pathogens.FindAsync(command.Id);
        if (pathogen is null)
        {
            logger.LogWarning("Pathogen ID not found");
            throw new NotFoundException(nameof(Pathogen), command.Id);
        }
        
        // Map command to model
        mapper.MapModel(pathogen, command);
        
        // Save changes to database
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to update pathogen");
            throw new InternalServerErrorException();
        }
    }
}