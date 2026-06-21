using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.ResistanceRiskFactors.DeleteResistanceRiskFactor;

public class DeleteResistanceRiskFactorHandler(IDbContext context, ILogger<DeleteResistanceRiskFactorHandler> logger)
    : ICommandHandler<DeleteResistanceRiskFactorCommand>
{
    public async Task HandleAsync(DeleteResistanceRiskFactorCommand command, CancellationToken cancellationToken = default)
    {
        // Get entity by ID
        var risk = await context.ResistanceRiskFactors
            .FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (risk is null)
        {
            logger.LogWarning("Resistance risk factor not found");
            throw new NotFoundException(nameof(ResistanceRiskFactor), command.Id);
        }

        // Delete entity
        risk.IsDeleted = true;
        risk.DeletedAt = DateTimeOffset.UtcNow;
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to delete resistance risk factor");
            throw new InternalServerErrorException();
        }
    }
}