using Application.Abstracts.CQRS;
using Application.Abstracts.Data;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using RespiraAMS_Platform.Shared.Exceptions;

namespace Application.Features.Diseases.DeleteDisease;

public class DeleteDiseaseHandler(IDbContext context, ILogger<DeleteDiseaseHandler> logger)
    : ICommandHandler<DeleteDiseaseCommand>
{
    public async Task HandleAsync(DeleteDiseaseCommand command)
    {
        // Get disease by ID
        var disease = await context.Diseases.FirstOrDefaultAsync(x => x.Id == command.Id);
        if (disease is null)
        {
            logger.LogWarning("Disease ID not found");
            throw new NotFoundException(nameof(Disease), command.Id);
        }
        
        // Start cascade delete in transaction
        await context.ExecuteInTransactionAsync(async () =>
        {
            // Delete disease
            disease.IsDeleted = true;
            disease.DeletedAt = DateTimeOffset.UtcNow;

            // Cascade delete
            var riskCount = await context.ResistanceRiskFactors
                .Where(x => x.DiseaseId == command.Id)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(r => r.IsDeleted, true)
                    .SetProperty(r => r.DeletedAt, DateTimeOffset.UtcNow));
            var diseasePathogenCount = await context.DiseasePathogens
                .Where(x => x.DiseaseId == command.Id)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(dp => dp.IsDeleted, true)
                    .SetProperty(dp => dp.DeletedAt, DateTimeOffset.UtcNow));
            var icuCount = await context.IcuHospitalizeCriteria
                .Where(x => x.DiseaseId == command.Id)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(icu => icu.IsDeleted, true)
                    .SetProperty(icu => icu.DeletedAt, DateTimeOffset.UtcNow));
            var protocolCount = await context.TreatmentProtocols
                .Where(x => x.DiseaseId == command.Id)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(p => p.IsDeleted, true)
                    .SetProperty(p => p.DeletedAt, DateTimeOffset.UtcNow));
            
            // Log result
            logger.LogInformation("Cascade delete disease: deleted {result}", new
            {
                ResistanceRiskFactorCount = riskCount,
                DiseasePathogenCount = diseasePathogenCount,
                IcuHospitalizeCriterionCount = icuCount,
                TreatmentProtocolsCount = protocolCount
            });
        });
    }
}