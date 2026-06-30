import { useQuery } from "@tanstack/react-query"
import { apiFetch, API_BASE } from "@/lib/api"
import { AntibioticItem, PathogenItem, DiseaseItem } from "./types"
import { Pagination, PaginationParam } from "@/lib/models"

export function getAntibiotics(params: PaginationParam) {
  const searchParams = new URLSearchParams()
  searchParams.set("Page", String(params.page))
  searchParams.set("Size", String(params.size))
  return apiFetch<Pagination<AntibioticItem>>(`${API_BASE}/antibiotics?${searchParams}`)
}

export function getPathogens(params: PaginationParam) {
  const searchParams = new URLSearchParams()
  searchParams.set("Page", String(params.page))
  searchParams.set("Size", String(params.size))
  return apiFetch<Pagination<PathogenItem>>(`${API_BASE}/pathogens?${searchParams}`)
}

export function getDiseases(params: PaginationParam) {
  const searchParams = new URLSearchParams()
  searchParams.set("Page", String(params.page))
  searchParams.set("Size", String(params.size))
  return apiFetch<Pagination<DiseaseItem>>(`${API_BASE}/diseases?${searchParams}`)
}

export function getDiseaseDetail(id: string) {
  return apiFetch<DiseaseItem>(`${API_BASE}/diseases/${id}`)
}

export function useAntibiotics(params: PaginationParam = { page: 1, size: 100 }) {
  return useQuery({
    queryKey: ["antibiotics", "list", params],
    queryFn: () => getAntibiotics(params),
  })
}

export function usePathogens(params: PaginationParam = { page: 1, size: 100 }) {
  return useQuery({
    queryKey: ["pathogens", "list", params],
    queryFn: () => getPathogens(params),
  })
}

export function useDiseases(params: PaginationParam) {
  return useQuery({
    queryKey: ["diseases", "list", params],
    queryFn: () => getDiseases(params),
  })
}
