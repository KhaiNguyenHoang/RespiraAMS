import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { createAntibiotic, deleteAntibiotic, getAntibiotics, updateAntibiotic } from "./api";
import { CreateAntibioticRequest, GetAntibioticsParams, UpdateAntibioticRequest } from "./models";

export const antibioticKeys = {
    all: ["antibiotics"] as const,
    list: (params: GetAntibioticsParams) => ["antibiotics", "list", params] as const,
}

export function useAntibiotics(params: GetAntibioticsParams) {
    return useQuery({
        queryKey: antibioticKeys.list(params),
        queryFn: () => getAntibiotics(params),
    });
}

export function useCreateAntibiotic() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: CreateAntibioticRequest) => createAntibiotic(req),
        onMutate: () => {
            const id = toast.loading("Creating antibiotic...");
            return { toastID: id }
        },
        onSuccess: async (response, __, variables) => {
            logger.info(`Created antibiotic successfully: ${response.id}`)
            await qc.invalidateQueries({ queryKey: antibioticKeys.all })
            toast.success("Antibiotic created successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error("Failed to create antibiotic");
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useUpdateAntibiotic() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: UpdateAntibioticRequest) => updateAntibiotic(req),
        onMutate: () => {
            const id = toast.loading("Updating antibiotic...");
            return { toastID: id }
        },
        onSuccess: async (_, __, variables) => {
            logger.info(`Update antibiotic successfully`)
            await qc.invalidateQueries({ queryKey: antibioticKeys.all })
            toast.success("Antibiotic updated successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error("Failed to update antibiotic");
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteAntibiotic() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAntibiotic(id),
        onMutate: () => {
            const id = toast.loading("Deleting antibiotic...");
            return { toastID: id }
        },
        onSuccess: async (_, __, variables) => {
            logger.info(`Delete antibiotic successfully`)
            await qc.invalidateQueries({ queryKey: antibioticKeys.all })
            toast.success("Antibiotic deleted successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error("Failed to delete antibiotic");
            toast.dismiss(variables?.toastID);
        }
    });
}