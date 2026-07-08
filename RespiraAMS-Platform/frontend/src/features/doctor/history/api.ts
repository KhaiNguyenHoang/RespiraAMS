import { useMutation, useQuery } from "@tanstack/react-query"
import { apiFetch, API_BASE } from "@/lib/api"
import { CreateTreatmentDecisionDto, CreateTreatmentDecisionResult, TreatmentDecisionItem, TreatmentDecisionResult } from "./types"
import { Pagination, PaginationParam } from "@/lib/models"
import { toast } from "sonner"

export function createTreatmentDecision(payload: CreateTreatmentDecisionDto) {
  return apiFetch<CreateTreatmentDecisionResult>(`${API_BASE}/treatment-decisions`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getTreatmentDecision(id: string) {
  return apiFetch<TreatmentDecisionResult>(`${API_BASE}/treatment-decisions/${id}`)
}

export function getHistory(doctorId: string, params: PaginationParam) {
  const searchParams = new URLSearchParams()
  searchParams.set("Page", String(params.page))
  searchParams.set("Size", String(params.size))
  return apiFetch<Pagination<TreatmentDecisionItem>>(
    `${API_BASE}/doctors/${doctorId}/history?${searchParams}`
  )
}

export function useCreateTreatmentDecision() {
  return useMutation<CreateTreatmentDecisionResult | null, Error, CreateTreatmentDecisionDto>({
    mutationFn: (payload) => createTreatmentDecision(payload),
    onError: () => toast.error("Lưu quyết định thất bại"),
  })
}

export function useHistory(doctorId: string, params: PaginationParam) {
  return useQuery({
    queryKey: ["history", doctorId, params],
    queryFn: () => getHistory(doctorId, params),
    enabled: !!doctorId,
  })
}

export function useTreatmentDecision(id: string) {
  return useQuery({
    queryKey: ["treatment-decision", id],
    queryFn: () => getTreatmentDecision(id),
    enabled: !!id,
  })
}
