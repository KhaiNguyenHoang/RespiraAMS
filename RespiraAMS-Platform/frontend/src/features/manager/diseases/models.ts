import { PaginationParam } from "@/lib/models";
import { IcuHospitalizeCriterion} from "../icuHospitalizeCriteria/models"
import { ResistanceRisk } from "../resistanceRisks/models"
import { DiseasePathogen } from "../diseasePathogens/models"
import { TreatmentProtocol } from "../treatmentProtocols/models"

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

export interface DiseaseDetail extends DiseaseItem {
    icuHospitalizeCriteria: IcuHospitalizeCriterion[];
    resistanceRisks: ResistanceRisk[];
    diseasePathogens: DiseasePathogen[];
    treatmentProtocols: TreatmentProtocol[];
}