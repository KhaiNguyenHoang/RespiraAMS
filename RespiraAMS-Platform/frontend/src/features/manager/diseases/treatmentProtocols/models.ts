import {Severity, TreatmentSite} from "../diseasePathogens/models"
import {Criterion} from "../criterionModels"
import {AntibioticItem} from "../../antibiotics/models"
import {PathogenItem} from "../../pathogens/models"

export interface TreatmentProtocol {
    id: string;
    updatedAt: string;
    name: string;
    issuer: string;
    issueDate: string;
    version: number;
}

export interface CreateTreatmentProtocolRequest {
    name: string;
    issuer: string;
    issueDate: string;
    version: number;
    severity: Severity | string;
    treatmentSite: TreatmentSite | string;
    specialInfectionId: string | null;
    otherCriteriaIds: string[];
    medicineIds: string[];
}

export interface TreatmentProtocolDetail extends TreatmentProtocol {
    severity: string;
    treatmentSite: string;
    specialInfection: PathogenItem;
    otherCriteria: Criterion[];
    medicines: AntibioticItem[];
}