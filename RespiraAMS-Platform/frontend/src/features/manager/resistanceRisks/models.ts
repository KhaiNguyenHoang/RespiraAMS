import { CreateCriterionDto, Criterion } from "../shared/models";

export interface ResistanceRisk {
    id: string;
    pathogen: string;
    name: string;
    criterion: Criterion;
}

export interface CreateResistanceRiskRequest {
    pathogenId: string;
    name: string;
    criterion: CreateCriterionDto;
}

export interface UpdateResistanceRiskRequest {
    id: string;
    pathogenId: string;
    name: string;
    criterion: CreateCriterionDto;
}