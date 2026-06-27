import { API_BASE, apiFetch } from "@/lib/api";
import { Pagination } from "@/lib/models";
import { 
    AntibioticItem, 
    CreateAntibioticRequest, 
    CreateAntibioticResult, 
    UpdateAntibioticRequest,
    GetAntibioticsParams 
} from "./models";
import { AntibioticSpectrumItem } from "../antibiotic_spectra/models";

export async function createAntibiotic(request: CreateAntibioticRequest): Promise<CreateAntibioticResult> {
    return await apiFetch<CreateAntibioticResult>(`${API_BASE}/antibiotics`, {
        method: "POST",
        body: JSON.stringify(request),
    }) as CreateAntibioticResult;
}

export async function getAntibiotics(params: GetAntibioticsParams): Promise<Pagination<AntibioticItem>> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) searchParams.set("Page", String(params.page));
    if (params?.size !== undefined) searchParams.set("Size", String(params.size));
    if (params?.name) searchParams.set("Name", params.name);
    if (params?.antibioticSpectrumId) searchParams.set("AntibioticSpectrumId", params.antibioticSpectrumId);
    if (params?.category) searchParams.set("Category", params.category);

    const query = searchParams.toString();
    return await apiFetch<Pagination<AntibioticItem>>(`${API_BASE}/antibiotics?${query}`) as Pagination<AntibioticItem>;
}

export async function updateAntibiotic(request: UpdateAntibioticRequest) {
    const body = {
        name: request.name,
        antibioticSpectrumId: request.antibioticSpectrumId,
        category: request.category,
        dosages: request.dosages,
    }

    await apiFetch(`${API_BASE}/antibiotics/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deleteAntibiotic(id: string) {
    await apiFetch(`${API_BASE}/antibiotics/${id}`, {
        method: "DELETE"
    });
}
