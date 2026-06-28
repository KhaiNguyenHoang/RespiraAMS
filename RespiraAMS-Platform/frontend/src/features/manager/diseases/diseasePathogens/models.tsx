export interface DiseasePathogen {
    id: string;
    pathogen: string;
    severity: "Mild" | "Moderate" | "Severe" | string;
    treatmentSite: "Outpatient" | "Inpatient" | "IntensiveCareUnit" | string;
}