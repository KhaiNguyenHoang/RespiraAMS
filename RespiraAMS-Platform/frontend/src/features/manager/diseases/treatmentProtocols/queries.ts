import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { createTreatmentProtocol, deleteTreatmentProtocol } from "./api";
import { CreateTreatmentProtocolRequest } from "./models";
import { diseaseKeys } from "../queries"
import {getTreatmentProtocolById} from "./api"

export function useCreateTreatmentProtocol(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: CreateTreatmentProtocolRequest) => createTreatmentProtocol(diseaseId, req),
        onMutate: () => ({ toastID: toast.loading("Adding treatment protocol...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Protocol added successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteTreatmentProtocol(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteTreatmentProtocol(id),
        onMutate: () => ({ toastID: toast.loading("Deleting protocol...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Protocol deleted successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export const protocolKeys = {
    detail: (id: string) => ["treatment-protocols", "detail", id] as const,
};

export function useTreatmentProtocolDetail(id: string) {
    return useQuery({
        queryKey: protocolKeys.detail(id),
        queryFn: () => getTreatmentProtocolById(id),
        enabled: !!id,
    });
}