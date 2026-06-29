import { API_BASE, apiFetch } from "@/lib/api";
import { Pagination } from "@/lib/models";
import { AddProtocolCriteriaRequest, CreateTreatmentProtocolRequest, TreatmentProtocolDetail, UpdateTreatmentProtocolRequest } from "./models";

export async function createTreatmentProtocol(diseaseId: string, request: CreateTreatmentProtocolRequest) {
    return await apiFetch(`${API_BASE}/diseases/${diseaseId}/treatment-protocols`, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export async function deleteTreatmentProtocol(id: string) {
    return await apiFetch(`${API_BASE}/treatment-protocols/${id}`, {
        method: "DELETE",
    });
}

export async function getTreatmentProtocolById(id: string): Promise<TreatmentProtocolDetail> {
    return await apiFetch<TreatmentProtocolDetail>(`${API_BASE}/treatment-protocols/${id}`) as TreatmentProtocolDetail;
}

export async function updateTreatmentProtocol(request: UpdateTreatmentProtocolRequest) {
    const body = {
        name: request.name,
        issuer: request.issuer,
        issueDate: request.issueDate,
        version: request.version,
        severity: request.severity,
        treatmentSite: request.treatmentSite,
        specialInfectionId: request.specialInfectionId,
        otherCriteriaIds: request.otherCriteriaIds,
        medicineIds: request.medicineIds
    };

    return await apiFetch(`${API_BASE}/treatment-protocols/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function addProtocolCriteria(protocolId: string, request: AddProtocolCriteriaRequest) {
    return await apiFetch(`${API_BASE}/treatment-protocols/${protocolId}/criteria`, {
        method: "PUT",
        body: JSON.stringify(request),
    });
}