import { PaginationParam } from "@/lib/models";

export interface CreateDiseaseRequest {
    name: string;
    description: string;
    requiredIcuMainCriteria: number;
    requiredIcuSecondaryCriteria: number;
}

export interface DiseaseItem {
    id: string;
    name: string;
    description: string;
    requiredIcuMainCriteria?: number;
    requiredIcuSecondaryCriteria?: number;
}

export interface UpdateDiseaseRequest {
    id: string;
    name: string;
    description: string;
    requiredIcuMainCriteria: number;
    requiredIcuSecondaryCriteria: number;
}

export interface GetDiseasesParams extends PaginationParam {
    name?: string;
}

export interface CreateDiseaseResult {
    id: string;
}

export interface Criterion {
    id: string;
    name: string;
    type: "boolean" | "numeric" | string;
    min: number | null;
    max: number | null;
    unit: string | null;
    isExclusive: boolean | null;
}

export interface IcuHospitalizeCriterion {
    id: string;
    isMainCriteria: boolean;
    criterion: Criterion;
}

export interface ResistanceRisk {
    id: string;
    pathogen: string;
    name: string;
    criterion: Criterion;
}

export interface DiseasePathogen {
    id: string;
    pathogen: string;
    severity: "Mild" | "Moderate" | "Severe" | string;
    treatmentSite: "Outpatient" | "Inpatient" | "IntensiveCareUnit" | string;
}

export interface TreatmentProtocol {
    id: string;
    updatedAt: string;
    name: string;
    issuer: string;
    issueDate: string;
    version: number;
}

export interface DiseaseDetail extends DiseaseItem {
    icuHospitalizeCriteria: IcuHospitalizeCriterion[];
    resistanceRisks: ResistanceRisk[];
    diseasePathogens: DiseasePathogen[];
    treatmentProtocols: TreatmentProtocol[];
}