using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Pathogens.CreatePathogen;

public class CreatePathogenHandler(
    IDbContext context,
    ICreateMapper<Pathogen, CreatePathogenCommand> mapper,
    ILogger<CreatePathogenHandler> logger)
    : ICommandHandler<CreatePathogenCommand, CreatePathogenResult>
{
    public async Task<CreatePathogenResult> HandleAsync(CreatePathogenCommand command)
    {
        // Map command to model
        var pathogen = mapper.ToModel(command);

        // Save changes to database
        await context.Pathogens.AddAsync(pathogen);
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to create pathogen");
            throw new InternalServerErrorException();
        }

        return new CreatePathogenResult(pathogen.Id);
    }
}