using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Marten;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Antibiotics.CreateAntibiotics;

public class CreateAntibioticHandler(
    IDbContext context,
    ICreateMapper<Antibiotic, CreateAntibioticCommand> mapper,
    ILogger<CreateAntibioticHandler> logger) 
    : ICommandHandler<CreateAntibioticCommand, CreateAntibioticResult>
{
    public async Task<CreateAntibioticResult> HandleAsync(CreateAntibioticCommand command)
    {
        // Validation: check if antibiotic spectrum exists
        if (await context.AntibioticSpectra.FirstOrDefaultAsync(x => x.Id == command.AntibioticSpectrumId) is null)
        {
            logger.LogWarning("Antibiotic spectrum ID not found");
            throw new NotFoundException(nameof(AntibioticSpectrum), command.AntibioticSpectrumId);
        }
        
        // Map from command to model
        var antibiotic = mapper.ToModel(command);

        // Save to database
        await context.Antibiotics.AddAsync(antibiotic);
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to create antibiotic");
            throw new InternalServerErrorException();
        }

        return new CreateAntibioticResult(antibiotic.Id);
    }
}