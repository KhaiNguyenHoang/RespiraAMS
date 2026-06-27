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