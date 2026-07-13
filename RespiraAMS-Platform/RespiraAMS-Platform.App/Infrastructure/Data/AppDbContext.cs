using Application.Abstracts.Data;
using Domain.Models;
using Infrastructure.Utils.Databases;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using RespiraAMS_Platform.Shared.Entities;

namespace Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IDbContext
{
    private IExecutionStrategy GetExecutionStrategy() => base.Database.CreateExecutionStrategy();

    public DbSet<Pathogen> Pathogens { get; set; }
    public DbSet<AntibioticSpectrum> AntibioticSpectra { get; set; }
    public DbSet<Antibiotic> Antibiotics { get; set; }
    public DbSet<Criterion> Criteria { get; set; }
    public DbSet<IcuHospitalizeCriterion> IcuHospitalizeCriteria { get; set; }
    public DbSet<ResistanceRiskFactor> ResistanceRiskFactors { get; set; }
    public DbSet<Disease> Diseases { get; set; }
    public DbSet<DiseasePathogen> DiseasePathogens { get; set; }
    public DbSet<TreatmentProtocol> TreatmentProtocols { get; set; }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await base.SaveChangesAsync(cancellationToken);
    }

    public async Task ExecuteInTransactionAsync(Func<Task> action, CancellationToken cancellationToken = default)
    {
        var strategy = GetExecutionStrategy();
        await strategy.ExecuteAsync(
            action,
            async (ctx, op, token) =>
            {
                await using var transaction = await ctx.Database
                    .BeginTransactionAsync(token);

                try
                {
                    await op();
                    await ctx.SaveChangesAsync(token);
                    await transaction.CommitAsync(token);
                }
                catch
                {
                    await transaction.RollbackAsync(token);
                    throw;
                }

                return true;
            },
            null,
            cancellationToken);
    }

    public async Task ExecuteInTransactionAsync(Action action, CancellationToken cancellationToken = default)
    {
        var strategy = GetExecutionStrategy();
        await strategy.ExecuteAsync(
            action,
            async (ctx, op, token) =>
            {
                await using var transaction = await ctx.Database
                    .BeginTransactionAsync(token);

                try
                {
                    op();
                    await ctx.SaveChangesAsync(token);
                    await transaction.CommitAsync(token);
                }
                catch
                {
                    await transaction.RollbackAsync(token);
                    throw;
                }

                return true;
            },
            null,
            cancellationToken);
    }

    /// <summary>
    /// Stubs are ONLY used to establish join-table FKs.
    /// </summary>
    /// <param name="id"></param>
    /// <typeparam name="T"></typeparam>
    /// <returns></returns>
    public T AttachStub<T>(Guid id) where T : BaseEntity
    {
        // If the entity has been tracked by EF Core
        var tracked = Set<T>().Local.FirstOrDefault(x => x.Id == id);
        if (tracked is not null)
        {
            return tracked;
        }

        // Create a stub object (fake object that just has the ID) -> save memory
        if (typeof(T) == typeof(Criterion))
        {
            // Criterion is abstract, so we instantiate a concrete subclass (e.g., NumericCriterion)
            var criterionStub = new NumericCriterion { Id = id };

            // Attach to database set as Unchanged
            Set<Criterion>().Attach(criterionStub);

            return (T)(object)criterionStub;
        }

        var stub = Activator.CreateInstance<T>();
        stub.Id = id;
        Set<T>().Attach(stub);
        return stub;
    }

    public void UpdateRelations<T>(ICollection<T> collection, IEnumerable<Guid>? ids) where T : BaseEntity
    {
        if (ids == null) return;
        var newIds = ids.ToHashSet();

        // Remove items no longer in the list
        var toRemove = collection.Where(x => !newIds.Contains(x.Id)).ToList();
        foreach (var item in toRemove)
        {
            collection.Remove(item);
        }

        // Add new items only
        var existingIds = collection.Select(x => x.Id).ToHashSet();
        foreach (var id in newIds.Where(id => !existingIds.Contains(id)))
        {
            collection.Add(AttachStub<T>(id));
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Global query filter
        modelBuilder.Entity<Pathogen>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<AntibioticSpectrum>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Antibiotic>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Criterion>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<IcuHospitalizeCriterion>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<ResistanceRiskFactor>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<DiseasePathogen>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Disease>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<TreatmentProtocol>().HasQueryFilter(x => !x.IsDeleted);

        // Config each entity
        modelBuilder.Entity<Pathogen>()
            .ToTable("pathogens");
        modelBuilder.Entity<Pathogen>()
            .HasMany(x => x.DiseasePathogens)
            .WithOne(x => x.Pathogen)
            .HasForeignKey(x => x.PathogenId);
        modelBuilder.Entity<Pathogen>()
            .HasMany(x => x.ResistanceRiskFactors)
            .WithOne(x => x.Pathogen)
            .HasForeignKey(x => x.PathogenId);
        modelBuilder.Entity<Pathogen>()
            .HasMany(x => x.TreatmentProtocols)
            .WithOne(x => x.SpecialInfection)
            .HasForeignKey(x => x.SpecialInfectionId);

        modelBuilder.Entity<AntibioticSpectrum>()
            .ToTable("antibiotic_spectra");

        modelBuilder.Entity<Criterion>()
            .UseTphMappingStrategy()
            .Ignore(x => x.Type)
            .ToTable("criteria")
            .HasDiscriminator<string>("type")
            .HasValue<NumericCriterion>("numeric")
            .HasValue<BooleanCriterion>("boolean");

        modelBuilder.Entity<Antibiotic>()
            .ToTable("antibiotics");
        modelBuilder.Entity<Antibiotic>()
            .Property(x => x.Category)
            .HasConversion<string>();
        modelBuilder.Entity<Antibiotic>()
            .Property(x => x.Dosages)
            .HasConversion(DictionaryConverter.Converter)
            .Metadata.SetValueComparer(DictionaryConverter.DosageComparer);
        modelBuilder.Entity<Antibiotic>()
            .HasOne(x => x.AntibioticSpectrum)
            .WithMany(x => x.Antibiotics);

        modelBuilder.Entity<IcuHospitalizeCriterion>()
            .ToTable("icu_hospitalize_criteria");
        modelBuilder.Entity<IcuHospitalizeCriterion>()
            .HasOne(x => x.Criterion)
            .WithOne();
        modelBuilder.Entity<IcuHospitalizeCriterion>()
            .HasOne(x => x.Disease)
            .WithMany(x => x.IcuHospitalizeCriteria)
            .HasForeignKey(x => x.DiseaseId);

        modelBuilder.Entity<ResistanceRiskFactor>()
            .ToTable("resistance_risk_factors");
        modelBuilder.Entity<ResistanceRiskFactor>()
            .HasOne(x => x.Criterion)
            .WithOne();
        modelBuilder.Entity<ResistanceRiskFactor>()
            .HasOne(x => x.Disease)
            .WithMany(x => x.ResistanceRisks)
            .HasForeignKey(x => x.DiseaseId);

        modelBuilder.Entity<DiseasePathogen>()
            .ToTable("disease_pathogens");
        modelBuilder.Entity<DiseasePathogen>()
            .Property(x => x.Severity)
            .HasConversion<string>();
        modelBuilder.Entity<DiseasePathogen>()
            .Property(x => x.TreatmentSite)
            .HasConversion<string>();
        modelBuilder.Entity<DiseasePathogen>()
            .HasOne(x => x.Disease)
            .WithMany(x => x.DiseasePathogens)
            .HasForeignKey(x => x.DiseaseId);
        // Since we use soft delete, adding unique constraints should be on the application level,
        // not database level
        // modelBuilder.Entity<DiseasePathogen>()
        //     .HasIndex(x => new { x.DiseaseId, x.PathogenId })
        //     .IsUnique();

        modelBuilder.Entity<Disease>()
            .ToTable("diseases");

        modelBuilder.Entity<TreatmentProtocol>()
            .ToTable("treatment_protocols");
        modelBuilder.Entity<TreatmentProtocol>()
            .Property(x => x.Severity)
            .HasConversion<string>();
        modelBuilder.Entity<TreatmentProtocol>()
            .Property(x => x.TreatmentSite)
            .HasConversion<string>();
        modelBuilder.Entity<TreatmentProtocol>()
            .Ignore(x => x.OtherCriteriaIds);
        modelBuilder.Entity<TreatmentProtocol>()
            .Ignore(x => x.MedicineIds);
        modelBuilder.Entity<TreatmentProtocol>()
            .HasMany(x => x.OtherCriteria)
            .WithMany();
        modelBuilder.Entity<TreatmentProtocol>()
            .HasMany(x => x.Medicines)
            .WithMany();
        modelBuilder.Entity<TreatmentProtocol>()
            .HasOne(x => x.Disease)
            .WithMany(x => x.TreatmentProtocols)
            .HasForeignKey(x => x.DiseaseId);
    }
}