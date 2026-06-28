import { API_BASE, apiFetch } from "@/lib/api";
import { Pagination } from "@/lib/models";
import { CreateTreatmentProtocolRequest } from "./models";

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

import { TreatmentProtocolDetail } from "./models";

export async function getTreatmentProtocolById(id: string): Promise<TreatmentProtocolDetail> {
    return await apiFetch<TreatmentProtocolDetail>(`${API_BASE}/treatment-protocols/${id}`) as TreatmentProtocolDetail;
}