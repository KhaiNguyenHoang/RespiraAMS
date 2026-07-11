using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.AntibioticSpectra.UpdateAntibioticSpectrum;

public class UpdateAntibioticSpectrumHandler(
    IDbContext context,
    IUpdateMapper<AntibioticSpectrum, UpdateAntibioticSpectrumCommand> mapper,
    ILogger<UpdateAntibioticSpectrumHandler> logger) 
    : ICommandHandler<UpdateAntibioticSpectrumCommand>
{
    public async Task HandleAsync(UpdateAntibioticSpectrumCommand command, CancellationToken cancellationToken = default)
    {
        // Get entity from database
        var spectrum = await context.AntibioticSpectra
            .FirstOrDefaultAsync(x => x.Id ==command.Id, cancellationToken);
        if (spectrum is null)
        {
            logger.LogWarning("Antibiotic spectrum ID not found");
            throw new NotFoundException(nameof(AntibioticSpectrum), command.Id);
        }

        // Map command to entity
        mapper.MapModel(spectrum, command);

        // Save changes
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to update antibiotic spectrum");
            throw new InternalServerErrorException();
        }
    }
}