export interface Criterion {
    id: string;
    name: string;
    type: "boolean" | "numeric" | string;
    min: number | null;
    max: number | null;
    unit: string | null;
    isExclusive: boolean | null;
}

export interface CreateCriterionDto {
    name: string;
    type: "Boolean" | "Numeric";
    min?: number | null;
    max?: number | null;
    unit?: string | null;
    isExclusive?: boolean | null;
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