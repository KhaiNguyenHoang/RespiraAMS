using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Application.Shared.Dtos;
using Application.Shared.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.TreatmentProtocols.AddNewCriteria;

public class AddNewCriteriaHandler(
    IDbContext context,
    ICreateMapper<Criterion, CreateCriterionCommand> mapper,
    ILogger<AddNewCriteriaHandler> logger) 
    : ICommandHandler<AddNewCriteriaCommand>
{
    public async Task HandleAsync(AddNewCriteriaCommand command)
    {
        // Get treatment protocol by ID
        var protocol = await context.TreatmentProtocols
            .Include(x => x.OtherCriteria)
            .FirstOrDefaultAsync(x => x.Id == command.Id);
        if (protocol is null)
        {
            logger.LogWarning("Treatment protocol ID not found");
            throw new NotFoundException(nameof(TreatmentProtocol), command.Id);
        }

        // Map request to models
        var criteria = command.Criteria.Select(mapper.ToModel).ToList();

        // Start transaction
        await context.ExecuteInTransactionAsync(async () =>
        {
            // Add batch
            await context.Criteria.AddRangeAsync(criteria);

            // Add the created list of criteria into the treatment protocol list
            // Since criteria list is already tracked by EF Core, we don't need to use stub
            protocol.OtherCriteria.AddRange(criteria);
        });
    }
}