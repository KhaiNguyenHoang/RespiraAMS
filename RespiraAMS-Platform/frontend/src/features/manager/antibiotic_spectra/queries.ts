import { PaginationParam } from "@/lib/models";
import { useQuery } from "@tanstack/react-query";
import { getAntibioticSpectra } from "./api";

/**
 * Key for TanStack Query to cache data if the same query is performed
 */
export const antibioticSpectrumKeys = {
    all: ["antibiotic-spectra"] as const,
    list: (params: PaginationParam) => ["antibiotic-spectra", "list", params] as const,
}

export function useAntibioticSpectra(params: PaginationParam) {
    return useQuery({
        queryKey: antibioticSpectrumKeys.list(params),
        queryFn: () => getAntibioticSpectra(params),
    });
}
