import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { createDiseasePathogen, updateDiseasePathogen, deleteDiseasePathogen } from "./api";
import { CreateDiseasePathogenRequest, UpdateDiseasePathogenRequest } from "./models";
import { diseaseKeys } from "../diseases/queries"

export function useCreateDiseasePathogen(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: CreateDiseasePathogenRequest) => createDiseasePathogen(diseaseId, req),
        onMutate: () => ({ toastID: toast.loading("Adding cause to disease...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Cause added successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useUpdateDiseasePathogen(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: UpdateDiseasePathogenRequest) => updateDiseasePathogen(req),
        onMutate: () => ({ toastID: toast.loading("Updating cause...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Cause updated successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteDiseasePathogen(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteDiseasePathogen(id),
        onMutate: () => ({ toastID: toast.loading("Removing cause...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("Cause removed successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}