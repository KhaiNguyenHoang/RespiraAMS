import { Criterion, CreateCriterionDto} from "../criterionModels"

export interface IcuHospitalizeCriterion {
    id: string;
    isMainCriteria: boolean;
    criterion: Criterion;
}

export interface CreateIcuCriteriaRequest {
    isMainCriteria: boolean;
    criterion: CreateCriterionDto;
}

export interface UpdateIcuCriteriaRequest {
    id: string;
    isMainCriteria: boolean;
    criterion: CreateCriterionDto;
}