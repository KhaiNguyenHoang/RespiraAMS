using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Marten;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Antibiotics.UpdateAntibiotic;

public class UpdateAntibioticHandler(
    IDbContext context,
    IUpdateMapper<Antibiotic, UpdateAntibioticCommand> mapper,
    ILogger<UpdateAntibioticHandler> logger)
    : ICommandHandler<UpdateAntibioticCommand>
{
    public async Task HandleAsync(UpdateAntibioticCommand command, CancellationToken cancellationToken = default)
    {
        // Validation: check if antibiotic spectrum exists
        var spectrum = await context.AntibioticSpectra
            .FirstOrDefaultAsync(x => x.Id == command.AntibioticSpectrumId, cancellationToken);
        if (spectrum is null)
        {
            logger.LogWarning("Antibiotic spectrum not exists");
            throw new NotFoundException(nameof(AntibioticSpectrum), command.AntibioticSpectrumId);
        }

        // Get antibiotic by ID
        var antibiotic = await context.Antibiotics.FirstOrDefaultAsync(x => x.Id == command.Id, cancellationToken);
        if (antibiotic is null)
        {
            throw new NotFoundException(nameof(Antibiotic), command.Id);
        }

        // Map command to model
        mapper.MapModel(antibiotic, command);

        // Save changes to database
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to update antibiotic");
            throw new InternalServerErrorException();
        }
    }
}