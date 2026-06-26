using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Antibiotics.CreateAntibiotics;

public class CreateAntibioticHandler(
    IDbContext context,
    ICreateMapper<Antibiotic, CreateAntibioticCommand> mapper,
    ILogger<CreateAntibioticHandler> logger)
    : ICommandHandler<CreateAntibioticCommand, CreateAntibioticResult>
{
    public async Task<CreateAntibioticResult> HandleAsync(CreateAntibioticCommand command,
        CancellationToken cancellationToken = default)
    {
        // Validation: check if antibiotic spectrum exists
        var spectrum = await context.AntibioticSpectra
            .FirstOrDefaultAsync(x => x.Id == command.AntibioticSpectrumId, cancellationToken);
        if (spectrum is null)
        {
            logger.LogWarning("Antibiotic spectrum ID not found");
            throw new NotFoundException(nameof(AntibioticSpectrum), command.AntibioticSpectrumId);
        }

        // Map from command to model
        var antibiotic = mapper.ToModel(command);

        // Save to database
        await context.Antibiotics.AddAsync(antibiotic, cancellationToken);
        if (await context.SaveChangesAsync(cancellationToken) <= 0)
        {
            logger.LogError("Failed to create antibiotic");
            throw new InternalServerErrorException();
        }

        return new CreateAntibioticResult(antibiotic.Id);
    }
}