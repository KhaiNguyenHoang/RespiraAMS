import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { getStatistics } from "./api";

export function useStatistics(doctorId?: string | null, month?: number | null, year?: number | null) {
    return useQuery({
        queryKey: ["statistics", { doctorId, month, year }],
        queryFn: () => getStatistics(doctorId, month, year),
    });
}