import { API_BASE, apiFetch } from "@/lib/api";
import { PagedDoctorResponse } from "./models";


export async function getPagedDoctors(page: number, pageSize: number = 10): Promise<PagedDoctorResponse> {
    return await apiFetch<PagedDoctorResponse>(`${API_BASE}/Profile/doctors?page=${page}&pageSize=${pageSize}`) as PagedDoctorResponse;
}