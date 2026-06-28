import { API_BASE, apiFetch } from "@/lib/api";
import { CreateResistanceRiskRequest, UpdateResistanceRiskRequest } from "./models";

export async function createResistanceRisk(diseaseId: string, request: CreateResistanceRiskRequest) {
    return await apiFetch(`${API_BASE}/diseases/${diseaseId}/resistance-risk-factors`, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export async function updateResistanceRisk(request: UpdateResistanceRiskRequest) {
    const body = {
        pathogenId: request.pathogenId,
        name: request.name,
        criterion: request.criterion
    };

    return await apiFetch(`${API_BASE}/resistance-risk-factors/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deleteResistanceRisk(id: string) {
    return await apiFetch(`${API_BASE}/resistance-risk-factors/${id}`, {
        method: "DELETE",
    });
}