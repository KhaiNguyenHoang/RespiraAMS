using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.IcuHospitalizeCriteria.CreateIcuHospitalizeCriterion;

public class CreateIcuHospitalizeCriterionHandler(
    IDbContext context,
    ICreateMapper<IcuHospitalizeCriterion, CreateIcuHospitalizeCriterionCommand> mapper,
    ILogger<CreateIcuHospitalizeCriterionHandler> logger)
    : ICommandHandler<CreateIcuHospitalizeCriterionCommand, CreateIcuHospitalizeCriterionResult>
{
    public async Task<CreateIcuHospitalizeCriterionResult> HandleAsync(CreateIcuHospitalizeCriterionCommand command)
    {
        // Validate FK
        if (await context.Diseases.FindAsync(command.DiseaseId) is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), command.DiseaseId);
        }
        
        // Map from command to model
        var icu = mapper.ToModel(command);
        
        // Save changes to database
        await context.IcuHospitalizeCriteria.AddAsync(icu);
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to create ICU hospitalize criterion");
            throw new InternalServerErrorException();
        }
        
        return new CreateIcuHospitalizeCriterionResult(icu.Id);
    }
}