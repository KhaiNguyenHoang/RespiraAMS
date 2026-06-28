import { CreateIcuCriteriaRequest, UpdateIcuCriteriaRequest } from "./models";
import { API_BASE, apiFetch } from "@/lib/api";

export async function createIcuCriterion(diseaseId: string, request: CreateIcuCriteriaRequest) {
    return await apiFetch(`${API_BASE}/diseases/${diseaseId}/icu-hospitalize-criteria`, {
        method: "POST",
        body: JSON.stringify(request),
    });
}

export async function updateIcuCriterion(request: UpdateIcuCriteriaRequest) {
    const body = {
        isMainCriteria: request.isMainCriteria,
        criterion: request.criterion
    };

    return await apiFetch(`${API_BASE}/icu-hospitalize-criteria/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deleteIcuCriterion(id: string) {
    return await apiFetch(`${API_BASE}/icu-hospitalize-criteria/${id}`, {
        method: "DELETE",
    });
}