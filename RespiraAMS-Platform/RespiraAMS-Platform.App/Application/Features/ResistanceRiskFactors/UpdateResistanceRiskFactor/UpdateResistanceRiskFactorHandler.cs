using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Exceptions;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;

public class UpdateResistanceRiskFactorHandler(
    IDbContext context,
    IUpdateMapper<ResistanceRiskFactor, UpdateResistanceRiskFactorCommand> mapper,
    ILogger<UpdateResistanceRiskFactorHandler> logger)
    : ICommandHandler<UpdateResistanceRiskFactorCommand>
{
    public async Task HandleAsync(UpdateResistanceRiskFactorCommand command)
    {
        // Validate FKs
        if (await context.Pathogens.FindAsync(command.PathogenId) is null)
        {
            logger.LogWarning("Pathogen ID not found");
            throw new NotFoundException(nameof(Pathogen), command.PathogenId);
        }

        // Get entity by ID
        var risk = await context.ResistanceRiskFactors
            .Include(x => x.Criterion)
            .FirstOrDefaultAsync(x => x.Id == command.Id);
        if (risk is null)
        {
            logger.LogWarning("Resistance risk factor not found");
            throw new NotFoundException(nameof(ResistanceRiskFactor), command.Id);
        }

        // Map from command to entity
        mapper.MapModel(risk, command);

        // Save changes to database
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to update resistance risk factor");
            throw new InternalServerErrorException();
        }
    }
}