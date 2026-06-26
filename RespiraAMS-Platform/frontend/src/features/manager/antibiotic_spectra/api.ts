import { API_BASE, apiFetch } from "@/lib/api";
import { AntibioticSpectrumItem, CreateAntibioticSpectrumRequest, CreateAntibioticSpectrumResult, UpdateAntibioticSpectrumRequest } from "./models";
import { Pagination, PaginationParam } from "@/lib/models";

export async function createAntibioticSpectrum(request: CreateAntibioticSpectrumRequest): Promise<CreateAntibioticSpectrumResult> {
    return await apiFetch<CreateAntibioticSpectrumResult>(`${API_BASE}/antibiotic-spectra`, {
        method: "POST",
        body: JSON.stringify(request),
    }) as CreateAntibioticSpectrumResult;
}

export async function getAntibioticSpectra(params: PaginationParam): Promise<Pagination<AntibioticSpectrumItem>> {
    const searchParams = new URLSearchParams();

    if (params?.page !== undefined) {
        searchParams.set("Page", String(params.page));
    }
    if (params?.size !== undefined) {
        searchParams.set("Size", String(params.size));
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