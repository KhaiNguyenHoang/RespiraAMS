import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { getPagedDoctors, getStatistics } from "./api";

export function useStatistics(doctorId?: string | null, month?: number | null, year?: number | null) {
    return useQuery({
        queryKey: ["statistics", { doctorId, month, year }],
        queryFn: () => getStatistics(doctorId, month, year),
    });
}

export function useInfiniteDoctors() {
    return useInfiniteQuery({
        queryKey: ["doctors", "infinite"],
        queryFn: ({ pageParam = 1 }) => getPagedDoctors(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.metadata.hasNext) {
                return lastPage.metadata.pageIndex + 1;
            }
            return undefined;
        },
    });
}