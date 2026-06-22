using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Marten;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.DiseasePathogens.DeleteDiseasePathogen;

public class DeleteDiseasePathogenHandler(IDbContext context, ILogger<DeleteDiseasePathogenHandler> logger)
    : ICommandHandler<DeleteDiseasePathogenCommand>
{
    public async Task HandleAsync(DeleteDiseasePathogenCommand command, CancellationToken cancellationToken = default)
    {
        // Get entity by ID
        var diseasePathogen = await context.DiseasePathogens
            .FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (diseasePathogen is null)
        {
            logger.LogWarning("Disease pathogen ID not found");
            throw new NotFoundException(nameof(DiseasePathogen), command.Id);
        }

        // Delete record
        diseasePathogen.IsDeleted = true;
        diseasePathogen.DeletedAt = DateTimeOffset.UtcNow;
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to delete disease pathogen");
            throw new InternalServerErrorException();
        }
    }
}