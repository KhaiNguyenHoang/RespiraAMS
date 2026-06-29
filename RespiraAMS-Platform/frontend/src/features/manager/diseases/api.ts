import { API_BASE, apiFetch } from "@/lib/api";
import { Pagination } from "@/lib/models";
import { DiseaseItem, CreateDiseaseRequest, UpdateDiseaseRequest, GetDiseasesParams, CreateDiseaseResult, DiseaseDetail } from "./models";

export async function createDisease(request: CreateDiseaseRequest): Promise<{ id: string }> {
    return await apiFetch<CreateDiseaseResult>(`${API_BASE}/diseases`, {
        method: "POST",
        body: JSON.stringify(request),
    }) as CreateDiseaseResult;
}

export async function getDiseases(params: GetDiseasesParams): Promise<Pagination<DiseaseItem>> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) searchParams.set("Page", String(params.page));
    if (params?.size !== undefined) searchParams.set("Size", String(params.size));
    if (params?.name) searchParams.set("Name", params.name);

    const query = searchParams.toString();
    return await apiFetch<Pagination<DiseaseItem>>(`${API_BASE}/diseases?${query}`) as Pagination<DiseaseItem>;
}

export async function updateDisease(request: UpdateDiseaseRequest) {
    const body = {
        name: request.name,
        description: request.description,
        requiredIcuMainCriteria: request.requiredIcuMainCriteria,
        requiredIcuSecondaryCriteria: request.requiredIcuSecondaryCriteria,
    };

    await apiFetch(`${API_BASE}/diseases/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deleteDisease(id: string) {
    await apiFetch(`${API_BASE}/diseases/${id}`, {
        method: "DELETE"
    });
}

export async function getDiseaseById(id: string): Promise<DiseaseDetail | null> {
    return await apiFetch<DiseaseDetail | null>(`${API_BASE}/diseases/${id}`);
}