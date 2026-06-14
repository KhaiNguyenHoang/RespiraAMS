using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.TreatmentProtocols.DeleteTreatmentProtocol;

public class DeleteTreatmentProtocolHandler(IDbContext context, ILogger<DeleteTreatmentProtocolHandler> logger)
    : ICommandHandler<DeleteTreatmentProtocolCommand>
{
    public async Task HandleAsync(DeleteTreatmentProtocolCommand command)
    {
        var protocol = await context.TreatmentProtocols.FindAsync(command.Id);
        if (protocol is null)
        {
            logger.LogWarning("Treatment protocol ID not found");
            throw new NotFoundException(nameof(TreatmentProtocol), command.Id);
        }

        protocol.IsDeleted = true;
        protocol.UpdatedAt = DateTimeOffset.UtcNow;

        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to delete treatment protocol");
            throw new InternalServerErrorException();
        }
    }
}