import { API_BASE, apiFetch } from "@/lib/api";
import { Pagination } from "@/lib/models";
import { PathogenItem, CreatePathogenRequest, UpdatePathogenRequest, GetPathogensParams, CreatePathogenResult } from "./models";

export async function createPathogen(request: CreatePathogenRequest): Promise<{ id: string }> {
    return await apiFetch<CreatePathogenResult>(`${API_BASE}/pathogens`, {
        method: "POST",
        body: JSON.stringify(request),
    }) as CreatePathogenResult;
}

export async function getPathogens(params: GetPathogensParams): Promise<Pagination<PathogenItem>> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) searchParams.set("Page", String(params.page));
    if (params?.size !== undefined) searchParams.set("Size", String(params.size));
    if (params?.name) searchParams.set("Name", params.name);

    const query = searchParams.toString();
    return await apiFetch<Pagination<PathogenItem>>(`${API_BASE}/pathogens?${query}`) as Pagination<PathogenItem>;
}

export async function updatePathogen(request: UpdatePathogenRequest) {
    const body = {
        name: request.name,
        description: request.description,
    };

    await apiFetch(`${API_BASE}/pathogens/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deletePathogen(id: string) {
    await apiFetch(`${API_BASE}/pathogens/${id}`, {
        method: "DELETE"
    });
}