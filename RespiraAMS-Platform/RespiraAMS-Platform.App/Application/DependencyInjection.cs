using Application.Abstracts.Mappers;
using Application.Features.Antibiotics.CreateAntibiotics;
using Application.Features.Antibiotics.UpdateAntibiotic;
using Application.Features.AntibioticSpectra.CreateAntibioticSpectrum;
using Application.Features.AntibioticSpectra.UpdateAntibioticSpectrum;
using Application.Features.DiseasePathogens.CreateDiseasePathogen;
using Application.Features.DiseasePathogens.UpdateDiseasePathogen;
using Application.Features.Diseases.CreateDisease;
using Application.Features.Diseases.UpdateDisease;
using Application.Features.IcuHospitalizeCriteria.CreateIcuHospitalizeCriterion;
using Application.Features.IcuHospitalizeCriteria.UpdateIcuHospitalizeCriterion;
using Application.Features.Pathogens.CreatePathogen;
using Application.Features.Pathogens.UpdatePathogen;
using Application.Features.ResistanceRiskFactors.CreateResistanceRiskFactor;
using Application.Features.ResistanceRiskFactors.UpdateResistanceRiskFactor;
using Application.Features.TreatmentProtocols.CreateTreatmentProtocol;
using Application.Features.TreatmentProtocols.UpdateTreatmentProtocol;
using Application.Shared.Dtos;
using Application.Shared.Mappers;
using Domain.Models;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

/// <summary>
///  This is just a dump class used for scanning assembly, it has no meaning in application code
/// </summary>
public class ApplicationMarker;

public static class DependencyInjection
{
    public static void AddProfiles(this IServiceCollection services)
    {
        services.AddScoped<ICreateMapper<Criterion, CreateCriterionCommand>, CreateCriterionMapper>();
        services.AddScoped<IUpdateMapper<Criterion, UpdateCriterionCommand>, UpdateCriterionMapper>();
        services.AddScoped<IResultMapper<Criterion, CriterionItem>, CriterionResultMapper>();
        
        services.AddScoped<ICreateMapper<AntibioticSpectrum, CreateAntibioticSpectrumCommand>,
            CreateAntibioticSpectrumMapper>();
        services.AddScoped<IUpdateMapper<AntibioticSpectrum, UpdateAntibioticSpectrumCommand>,
            UpdateAntibioticSpectrumMapper>();

        services.AddScoped<ICreateMapper<Antibiotic, CreateAntibioticCommand>, CreateAntibioticMapper>();
        services.AddScoped<IUpdateMapper<Antibiotic, UpdateAntibioticCommand>, UpdateAntibioticMapper>();

        services.AddScoped<ICreateMapper<DiseasePathogen, CreateDiseasePathogenCommand>, CreateDiseasePathogenMapper>();
        services.AddScoped<IUpdateMapper<DiseasePathogen, UpdateDiseasePathogenCommand>, UpdateDiseasePathogenMapper>();

        services.AddScoped<ICreateMapper<Disease, CreateDiseaseCommand>, CreateDiseaseMapper>();
        services.AddScoped<IUpdateMapper<Disease, UpdateDiseaseCommand>, UpdateDiseaseMapper>();

        services.AddScoped<ICreateMapper<IcuHospitalizeCriterion, CreateIcuHospitalizeCriterionCommand>,
            CreateIcuHospitalizeCriterionMapper>();
        services.AddScoped<IUpdateMapper<IcuHospitalizeCriterion, UpdateIcuHospitalizeCriterionCommand>,
            UpdateIcuHospitalizeCriterionMapper>();

        services.AddScoped<ICreateMapper<Pathogen, CreatePathogenCommand>, CreatePathogenMapper>();
        services.AddScoped<IUpdateMapper<Pathogen, UpdatePathogenCommand>, UpdatePathogenMapper>();

        services.AddScoped<ICreateMapper<ResistanceRiskFactor, CreateResistanceRiskFactorCommand>,
            CreateResistanceRiskFactorMapper>();
        services.AddScoped<IUpdateMapper<ResistanceRiskFactor, UpdateResistanceRiskFactorCommand>,
            UpdateResistanceRiskFactorMapper>();

        services.AddScoped<ICreateMapper<TreatmentProtocol, CreateTreatmentProtocolCommand>,
            CreateTreatmentProtocolMapper>();
        services.AddScoped<IUpdateMapper<TreatmentProtocol, UpdateTreatmentProtocolCommand>,
            UpdateTreatmentProtocolMapper>();
    }

    public static void AddFluentValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining<ApplicationMarker>();
    }
}