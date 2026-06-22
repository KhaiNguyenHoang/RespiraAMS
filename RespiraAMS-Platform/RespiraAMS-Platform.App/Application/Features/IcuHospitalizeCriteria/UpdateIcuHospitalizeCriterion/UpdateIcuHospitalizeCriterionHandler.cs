using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.IcuHospitalizeCriteria.UpdateIcuHospitalizeCriterion;

public class UpdateIcuHospitalizeCriterionHandler(
    IDbContext context,
    IUpdateMapper<IcuHospitalizeCriterion, UpdateIcuHospitalizeCriterionCommand> mapper,
    ILogger<UpdateIcuHospitalizeCriterionHandler> logger)
    : ICommandHandler<UpdateIcuHospitalizeCriterionCommand>
{
    public async Task HandleAsync(UpdateIcuHospitalizeCriterionCommand command, CancellationToken cancellationToken = default)
    {
        // Get entity by ID
        var icu = await context.IcuHospitalizeCriteria
            .Include(x => x.Criterion)
            .FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (icu is null)
        {
            logger.LogWarning("ICU hospitalize criterion not found");
            throw new NotFoundException(nameof(IcuHospitalizeCriterion), command.Id);
        }
        
        // Map from command to entity
        mapper.MapModel(icu, command);
        
        // Save changes to database
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to update ICU hospitalize criterion");
            throw new InternalServerErrorException();
        }
    }
}