using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Antibiotics.DeleteAntibiotic;

public class DeleteAntibioticHandler(IDbContext context, ILogger<DeleteAntibioticHandler> logger)
    : ICommandHandler<DeleteAntibioticCommand>
{
    public async Task HandleAsync(DeleteAntibioticCommand command, CancellationToken cancellationToken = default)
    {
        var antibiotic = await context.Antibiotics
            .FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (antibiotic is null)
        {
            logger.LogWarning("Antibiotic ID not found");
            throw new NotFoundException(nameof(Antibiotic), command.Id);
        }

        antibiotic.IsDeleted = true;
        antibiotic.DeletedAt = DateTimeOffset.UtcNow;

        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to delete antibiotic");
            throw new InternalServerErrorException();
        }
    }
}