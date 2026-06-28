import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { createResistanceRisk, updateResistanceRisk, deleteResistanceRisk } from "./api";
import { CreateResistanceRiskRequest, UpdateResistanceRiskRequest } from "./models";
import { diseaseKeys } from "../queries"

export function useCreateResistanceRisk(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: CreateResistanceRiskRequest) => createResistanceRisk(diseaseId, req),
        onMutate: () => ({ toastID: toast.loading("Adding resistance risk...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Resistance risk added successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useUpdateResistanceRisk(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: UpdateResistanceRiskRequest) => updateResistanceRisk(req),
        onMutate: () => ({ toastID: toast.loading("Updating resistance risk...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Resistance risk updated successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteResistanceRisk(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteResistanceRisk(id),
        onMutate: () => ({ toastID: toast.loading("Deleting resistance risk...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Resistance risk deleted successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}