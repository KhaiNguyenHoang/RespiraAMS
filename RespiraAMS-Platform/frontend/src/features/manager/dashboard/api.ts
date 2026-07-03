import { API_BASE, apiFetch } from "@/lib/api";
import { PagedDoctorResponse, StatisticsData } from "./models";

export async function getStatistics(doctorId?: string | null, month?: number | null, year?: number | null): Promise<StatisticsData> {
    const params = new URLSearchParams();
    if (doctorId) params.append("DoctorId", doctorId);
    if (month) params.append("Month", month.toString());
    if (year) params.append("Year", year.toString());

    return await apiFetch<StatisticsData>(`${API_BASE}/statistics?${params.toString()}`, {
        headers: { "X-Role": "manager" }
    }) as StatisticsData;
}

export async function getPagedDoctors(page: number, pageSize: number = 10): Promise<PagedDoctorResponse> {
    return await apiFetch<PagedDoctorResponse>(`${API_BASE}/Profile/doctors?page=${page}&pageSize=${pageSize}`) as PagedDoctorResponse;
}