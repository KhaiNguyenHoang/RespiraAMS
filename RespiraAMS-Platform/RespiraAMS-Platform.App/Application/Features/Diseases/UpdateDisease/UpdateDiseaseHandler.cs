using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Diseases.UpdateDisease;

public class UpdateDiseaseHandler(
    IDbContext context,
    IUpdateMapper<Disease, UpdateDiseaseCommand> mapper,
    ILogger<UpdateDiseaseHandler> logger)
    : ICommandHandler<UpdateDiseaseCommand>
{
    public async Task HandleAsync(UpdateDiseaseCommand command, CancellationToken cancellationToken = default)
    {
        // Get disease by ID
        var disease = await context.Diseases
            .FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (disease is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), command.Id);
        }
        
        // Map from command to model
        mapper.MapModel(disease, command);
        
        // Save changes to database
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to update disease information");
            throw new InternalServerErrorException();
        }
    }
}