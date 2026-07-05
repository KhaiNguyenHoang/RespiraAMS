import { useMutation, useQuery } from "@tanstack/react-query"
import { apiFetch, API_BASE } from "@/lib/api"
import { DiagnoseRequest, DiagnoseResponse, DiseaseItem, DiseaseResult } from "./types"
import { Pagination, PaginationParam } from "@/lib/models"
import { toast } from "sonner"

export function diagnose(payload: DiagnoseRequest) {
  return apiFetch<DiagnoseResponse>(`${API_BASE}/diagnose`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getDiseases(params: PaginationParam) {
  const searchParams = new URLSearchParams()
  searchParams.set("Page", String(params.page))
  searchParams.set("Size", String(params.size))
  return apiFetch<Pagination<DiseaseItem>>(`${API_BASE}/diseases?${searchParams}`)
}

export function getDisease(id: string) {
  return apiFetch<DiseaseResult>(`${API_BASE}/diseases/${id}`)
}

export function useDiagnose() {
  return useMutation<DiagnoseResponse | null, Error, DiagnoseRequest>({
    mutationFn: (payload) => diagnose(payload),
    onError: () => toast.error("Chẩn đoán thất bại"),
  })
}

export function useDiseases(params: PaginationParam) {
  return useQuery({
    queryKey: ["diseases", "list", params],
    queryFn: () => getDiseases(params),
  })
}

export function useDisease(id: string) {
  return useQuery({
    queryKey: ["disease", id],
    queryFn: () => getDisease(id),
    enabled: !!id,
  })
}
