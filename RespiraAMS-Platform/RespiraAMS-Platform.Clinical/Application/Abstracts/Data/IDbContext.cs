using Domain.Models;
using Microsoft.EntityFrameworkCore;
using RespiraAMS_Platform.Shared.Entities;

namespace Application.Abstracts.Data;

public interface IDbContext
{
    DbSet<Pathogen> Pathogens { get; }
    DbSet<AntibioticSpectrum> AntibioticSpectra { get; }
    DbSet<Antibiotic> Antibiotics { get; }
    DbSet<Criterion> Criteria { get; }
    DbSet<IcuHospitalizeCriterion> IcuHospitalizeCriteria { get; }
    DbSet<ResistanceRiskFactor> ResistanceRiskFactors { get; }
    DbSet<Disease> Diseases { get; }
    DbSet<DiseasePathogen> DiseasePathogens { get; }
    DbSet<TreatmentProtocol> TreatmentProtocols { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task ExecuteInTransactionAsync(Func<Task> action, CancellationToken cancellationToken = default);
    Task ExecuteInTransactionAsync(Action action, CancellationToken cancellationToken = default);
    T AttachStub<T>(Guid id) where T : BaseEntity;
    void UpdateRelations<T>(ICollection<T> collection, IEnumerable<Guid>? ids) where T : BaseEntity;
}