import { API_BASE, apiFetch } from "@/lib/api";
import { Pagination } from "@/lib/models";
import { CreateDiseasePathogenRequest, UpdateDiseasePathogenRequest } from "./models";

export async function createDiseasePathogen(diseaseId: string, request: CreateDiseasePathogenRequest) {
    return await apiFetch(`${API_BASE}/diseases/${diseaseId}/causes`, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export async function updateDiseasePathogen(request: UpdateDiseasePathogenRequest) {
    const body = {
        severity: request.severity,
        treatmentSite: request.treatmentSite
    };

    return await apiFetch(`${API_BASE}/causes/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deleteDiseasePathogen(id: string) {
    return await apiFetch(`${API_BASE}/causes/${id}`, {
        method: "DELETE",
    });
}