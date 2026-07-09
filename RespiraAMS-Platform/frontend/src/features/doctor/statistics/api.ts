import { useQuery } from "@tanstack/react-query"
import { apiFetch, API_BASE } from "@/lib/api"
import { StatisticsResult } from "./types"

export function getStatistics(doctorId?: string, month?: number, year?: number) {
  const searchParams = new URLSearchParams()
  if (doctorId) searchParams.set("DoctorId", doctorId)
  if (month != null) searchParams.set("Month", String(month))
  if (year != null) searchParams.set("Year", String(year))
  const qs = searchParams.toString()
  return apiFetch<StatisticsResult>(`${API_BASE}/statistics${qs ? `?${qs}` : ""}`)
}

export function useStatistics(doctorId?: string, month?: number, year?: number) {
  return useQuery({
    queryKey: ["statistics", doctorId, month, year],
    queryFn: () => getStatistics(doctorId, month, year),
  })
}
