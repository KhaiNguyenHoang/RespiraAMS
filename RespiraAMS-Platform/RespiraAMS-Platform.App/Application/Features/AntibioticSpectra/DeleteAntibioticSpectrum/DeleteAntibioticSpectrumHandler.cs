using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.AntibioticSpectra.DeleteAntibioticSpectrum;

public class DeleteAntibioticSpectrumHandler(IDbContext context, ILogger<DeleteAntibioticSpectrumHandler> logger)
    : ICommandHandler<DeleteAntibioticSpectrumCommand>
{
    public async Task HandleAsync(DeleteAntibioticSpectrumCommand command)
    {
        // Get entity from database
        var spectrum = await context.AntibioticSpectra.FirstOrDefaultAsync(x => x.Id == command.Id);
        if (spectrum is null)
        {
            logger.LogWarning("Antibiotic spectrum ID not found");
            throw new NotFoundException(nameof(AntibioticSpectrum), command.Id);
        }

        // Start delete with cascade transaction
        await context.ExecuteInTransactionAsync(async () =>
        {
            // Delete spectrum
            spectrum.IsDeleted = true;
            spectrum.DeletedAt = DateTimeOffset.UtcNow;

            // Cascade delete antibiotic
            var count = await context.Antibiotics
                .Where(x => x.AntibioticSpectrumId == command.Id)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(a => a.IsDeleted, true)
                    .SetProperty(a => a.DeletedAt, DateTimeOffset.UtcNow));
            logger.LogInformation("Cascade delete antibiotic spectrum: deleted {count} antibiotic", count);
        });
    }
}