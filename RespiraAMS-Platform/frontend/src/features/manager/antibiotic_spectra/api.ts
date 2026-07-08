import { API_BASE, apiFetch } from "@/lib/api";
import { AntibioticSpectrumItem, CreateAntibioticSpectrumRequest, CreateAntibioticSpectrumResult, GetAntibioticSpectraParams, UpdateAntibioticSpectrumRequest } from "./models";
import { Pagination } from "@/lib/models";

export async function createAntibioticSpectrum(request: CreateAntibioticSpectrumRequest): Promise<CreateAntibioticSpectrumResult> {
    return await apiFetch<CreateAntibioticSpectrumResult>(`${API_BASE}/antibiotic-spectra`, {
        method: "POST",
        body: JSON.stringify(request),
    }) as CreateAntibioticSpectrumResult;
}

export async function getAntibioticSpectra(params: GetAntibioticSpectraParams): Promise<Pagination<AntibioticSpectrumItem>> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
        searchParams.set("Page", String(params.page));
    }
    if (params?.size !== undefined) {
        searchParams.set("Size", String(params.size));
    }
    if (params?.name) {
        searchParams.set("Name", params.name);
    }

    const query = searchParams.toString();
    return await apiFetch<Pagination<AntibioticSpectrumItem>>(`${API_BASE}/antibiotic-spectra?${query}`) as Pagination<AntibioticSpectrumItem>;
}

export async function updateAntibioticSpectrum(request: UpdateAntibioticSpectrumRequest) {
    const body = {
        name: request.name,
        description: request.description,
    }

    await apiFetch(`${API_BASE}/antibiotic-spectra/${request.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    })
}

export async function deleteAntibioticSpectrum(id: string) {
    await apiFetch(`${API_BASE}/antibiotic-spectra/${id}`, {
        method: "DELETE"
    });
}

export async function getAntibioticSpectraList(): Promise<AntibioticSpectrumItem[]> {
    const result = await apiFetch<AntibioticSpectrumItem[]>(`${API_BASE}/antibiotic-spectra/list`);
    return result ?? [];
}