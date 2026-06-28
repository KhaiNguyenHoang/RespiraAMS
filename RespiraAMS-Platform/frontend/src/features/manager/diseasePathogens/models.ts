export interface DiseasePathogen {
    id: string;
    pathogen: string;
    severity: "Mild" | "Moderate" | "Severe" | string;
    treatmentSite: "Outpatient" | "Inpatient" | "IntensiveCareUnit" | string;
}

export enum Severity {
    Mild = "Mild",
    Moderate = "Moderate",
    Severe = "Severe"
}

export enum TreatmentSite {
    Outpatient = "Outpatient",
    Inpatient = "Inpatient",
    IntensiveCareUnit = "IntensiveCareUnit"
}

export interface CreateDiseasePathogenRequest {
    pathogenId: string;
    severity: Severity | string;
    treatmentSite: TreatmentSite | string;
}

export interface UpdateDiseasePathogenRequest {
    id: string;
    severity: Severity | string;
    treatmentSite: TreatmentSite | string;
}