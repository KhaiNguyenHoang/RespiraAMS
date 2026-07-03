import { API_BASE, apiFetch } from "@/lib/api";
import { PagedDoctorResponse } from "./models";

export async function getDoctors(page: number, pageSize: number = 10): Promise<PagedDoctorResponse> {
    return await apiFetch<PagedDoctorResponse>(`${API_BASE}/Profile/doctors?page=${page}&pageSize=${pageSize}`) as PagedDoctorResponse;
}

export async function createDoctor(data: FormData) {
    return await apiFetch(`${API_BASE}/Profile/create/doctor`, {
        method: "POST",
        body: data, 
    });
}

export async function deleteDoctor(id: string) {
    return await apiFetch(`${API_BASE}/Profile/delete/doctor/${id}`, {
        method: "DELETE",
    });
}