using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;

public class CreateAntibioticSpectrumHandler(
    IDbContext context,
    ICreateMapper<AntibioticSpectrum, CreateAntibioticSpectrumCommand> mapper,
    ILogger<CreateAntibioticSpectrumHandler> logger)
    : ICommandHandler<CreateAntibioticSpectrumCommand, CreateAntibioticSpectrumResult>
{
    public async Task<CreateAntibioticSpectrumResult> HandleAsync(CreateAntibioticSpectrumCommand command)
    {
        // Create antibiotic spectrum
        var spectrum = mapper.ToModel(command);

        // Save to database
        await context.AntibioticSpectra.AddAsync(spectrum);
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to create antibiotic spectrum");
            throw new InternalServerErrorException();
        }
        
        return new CreateAntibioticSpectrumResult(spectrum.Id);
    }
}