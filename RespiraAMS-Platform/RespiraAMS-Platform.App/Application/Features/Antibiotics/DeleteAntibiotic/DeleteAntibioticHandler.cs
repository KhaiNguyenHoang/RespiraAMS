using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.Extensions.Logging;

namespace Application.Features.Antibiotics.DeleteAntibiotic;

public class DeleteAntibioticHandler(IDbContext context, ILogger<DeleteAntibioticHandler> logger)
    : ICommandHandler<DeleteAntibioticCommand>
{
    public async Task HandleAsync(DeleteAntibioticCommand command)
    {
        var antibiotic = await context.Antibiotics.FindAsync(command.Id);
        if (antibiotic is null)
        {
            logger.LogWarning("Antibiotic ID not found");
            throw new NotFoundException(nameof(Antibiotic), command.Id);
        }

        antibiotic.IsDeleted = true;
        antibiotic.UpdatedAt = DateTimeOffset.UtcNow;

        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to delete antibiotic");
            throw new InternalServerErrorException();
        }
    }
}