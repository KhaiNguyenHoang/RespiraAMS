import { Criterion, CreateCriterionDto} from "../criterionModels"

export interface ResistanceRisk {
    id: string;
    pathogen: string;
    name: string;
    criterion: Criterion;
}