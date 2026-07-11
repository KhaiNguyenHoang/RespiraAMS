using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.IcuHospitalizeCriteria.DeleteIcuHospitalizeCriterion;

public class DeleteIcuHospitalizeCriterionHandler(
    IDbContext context,
    ILogger<DeleteIcuHospitalizeCriterionHandler> logger)
    : ICommandHandler<DeleteIcuHospitalizeCriterionCommand>
{
    public async Task HandleAsync(DeleteIcuHospitalizeCriterionCommand command, CancellationToken cancellationToken = default)
    {
        // Get entity by ID
        var icu = await context.IcuHospitalizeCriteria
            .FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (icu is null)
        {
            logger.LogWarning("ICU hospitalize criterion ID not found");
            throw new NotFoundException(nameof(IcuHospitalizeCriteria), command.Id);
        }
        
        // Delete entity
        icu.IsDeleted = true;
        icu.DeletedAt = DateTimeOffset.UtcNow;
        
        // Save changes to database
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to delete ICU hospitalize criterion");
            throw new InternalServerErrorException();
        }
    }
}