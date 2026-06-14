using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Application.Abstracts.Mappers;
using Domain.Models;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Diseases.CreateDisease;

public class CreateDiseaseHandler(
    IDbContext context,
    ICreateMapper<Disease, CreateDiseaseCommand> mapper,
    ILogger<CreateDiseaseHandler> logger)
    : ICommandHandler<CreateDiseaseCommand, CreateDiseaseResult>
{
    public async Task<CreateDiseaseResult> HandleAsync(CreateDiseaseCommand command)
    {
        // Map from command to model
        var disease = mapper.ToModel(command);
        
        // Save changes to database
        await context.Diseases.AddAsync(disease);
        if (await context.SaveChangesAsync() <= 0)
        {
            logger.LogError("Failed to create disease");
            throw new InternalServerErrorException();
        }

        return new CreateDiseaseResult(disease.Id);
    }
}