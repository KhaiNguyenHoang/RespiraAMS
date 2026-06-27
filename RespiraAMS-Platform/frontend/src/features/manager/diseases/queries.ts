import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { createDisease, deleteDisease, getDiseases, updateDisease } from "./api";
import { CreateDiseaseRequest, GetDiseasesParams, UpdateDiseaseRequest } from "./models";
import { getDiseaseById } from "./api";

export const diseaseKeys = {
    all: ["diseases"] as const,
    list: (params: GetDiseasesParams) => ["diseases", "list", params] as const,
    detail: (id: string) => ["diseases", "detail", id] as const,
};

export function useDiseases(params: GetDiseasesParams) {
    return useQuery({
        queryKey: diseaseKeys.list(params),
        queryFn: () => getDiseases(params),
    });
}

export function useCreateDisease() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: CreateDiseaseRequest) => createDisease(req),
        onMutate: () => ({ toastID: toast.loading("Creating disease...") }),
        onSuccess: async (_, __, variables) => {
            logger.info(`Created disease successfully`);
            await qc.invalidateQueries({ queryKey: diseaseKeys.all });
            toast.success("Disease created successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useUpdateDisease() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: UpdateDiseaseRequest) => updateDisease(req),
        onMutate: () => ({ toastID: toast.loading("Updating disease...") }),
        onSuccess: async (_, __, variables) => {
            logger.info(`Updated disease successfully`);
            await qc.invalidateQueries({ queryKey: diseaseKeys.all });
            toast.success("Disease updated successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteDisease() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteDisease(id),
        onMutate: () => ({ toastID: toast.loading("Deleting disease...") }),
        onSuccess: async (_, __, variables) => {
            logger.info(`Deleted disease successfully`);
            await qc.invalidateQueries({ queryKey: diseaseKeys.all });
            toast.success("Disease deleted successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDiseaseDetail(id: string) {
    return useQuery({
        queryKey: diseaseKeys.detail(id),
        queryFn: () => getDiseaseById(id),
        enabled: !!id,
    });
}