using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.ResistanceRiskFactors.CreateResistanceRiskFactor;

public class CreateResistanceRiskFactorHandler(
    IDbContext context,
    ICreateMapper<ResistanceRiskFactor, CreateResistanceRiskFactorCommand> mapper,
    ILogger<CreateResistanceRiskFactorHandler> logger)
    : ICommandHandler<CreateResistanceRiskFactorCommand, CreateResistanceRiskFactorResult>
{
    public async Task<CreateResistanceRiskFactorResult> HandleAsync(CreateResistanceRiskFactorCommand command, CancellationToken cancellationToken = default)
    {
        // Validate FKs
        var disease = await context.Diseases
            .FirstOrDefaultAsync(x => x.Id == command.DiseaseId, cancellationToken);
        if (disease is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), command.DiseaseId);
        }

        var pathogen = await context.Pathogens
            .FirstOrDefaultAsync(x => x.Id == command.PathogenId, cancellationToken);
        if (pathogen is null)
        {
            logger.LogWarning("Pathogen ID not found");
            throw new NotFoundException(nameof(Pathogen), command.PathogenId);
        }
        
        // Map from command to query
        var risk = mapper.ToModel(command);
        
        // Save changes to database
        await context.ResistanceRiskFactors.AddAsync(risk, cancellationToken);
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to create resistance risk factor");
            throw new InternalServerErrorException();
        }

        return new CreateResistanceRiskFactorResult(risk.Id);
    }
}