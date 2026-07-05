export interface DiseasePathogen {
    id: string;
    pathogen: string;
    severity: "Mild" | "Moderate" | "Severe" | string;
    treatmentSite: "Outpatient" | "Inpatient" | "IntensiveCareUnit" | string;
}

import { Severity, TreatmentSite } from "../shared/models";
export { Severity, TreatmentSite };

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