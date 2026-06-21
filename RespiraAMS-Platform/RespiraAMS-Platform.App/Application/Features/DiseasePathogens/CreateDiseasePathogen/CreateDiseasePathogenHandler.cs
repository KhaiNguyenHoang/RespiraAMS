using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.DiseasePathogens.CreateDiseasePathogen;

public class CreateDiseasePathogenHandler(
    IDbContext context,
    ICreateMapper<DiseasePathogen, CreateDiseasePathogenCommand> mapper,
    ILogger<CreateDiseasePathogenHandler> logger)
    : ICommandHandler<CreateDiseasePathogenCommand, CreateDiseasePathogenResult>
{
    public async Task<CreateDiseasePathogenResult> HandleAsync(CreateDiseasePathogenCommand command, CancellationToken cancellationToken = default)
    {
        // Validate foreign keys
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
        
        // Map from command to entity
        var diseasePathogen = mapper.ToModel(command);
        
        // Save changes to database
        await context.DiseasePathogens.AddAsync(diseasePathogen, cancellationToken);
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to create disease pathogen record");
            throw new InternalServerErrorException();
        }

        return new CreateDiseasePathogenResult(diseasePathogen.Id);
    }
}