using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.Extensions.Logging;

namespace Application.Features.Diseases.UpdateDisease;

public class UpdateDiseaseHandler(
    IDbContext context,
    IUpdateMapper<Disease, UpdateDiseaseCommand> mapper,
    ILogger<UpdateDiseaseHandler> logger)
    : ICommandHandler<UpdateDiseaseCommand>
{
    public async Task HandleAsync(UpdateDiseaseCommand command)
    {
        // Get disease by ID
        var disease = await context.Diseases.FindAsync(command.Id);
        if (disease is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), command.Id);
        }
        
        // Map from command to model
        mapper.MapModel(disease, command);
        
        // Save changes to database
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to update disease information");
            throw new InternalServerErrorException();
        }
    }
}