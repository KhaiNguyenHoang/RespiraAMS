import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { createIcuCriterion, updateIcuCriterion, deleteIcuCriterion } from "./api";
import { CreateIcuCriteriaRequest, UpdateIcuCriteriaRequest } from "./models";
import { diseaseKeys } from "../diseases/queries"

export function useCreateIcuCriterion(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: CreateIcuCriteriaRequest) => createIcuCriterion(diseaseId, req),
        onMutate: () => ({ toastID: toast.loading("Adding ICU Criterion...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("ICU Criterion added successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useUpdateIcuCriterion(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (req: UpdateIcuCriteriaRequest) => updateIcuCriterion(req),
        onMutate: () => ({ toastID: toast.loading("Updating ICU Criterion...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("ICU Criterion updated successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteIcuCriterion(diseaseId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteIcuCriterion(id),
        onMutate: () => ({ toastID: toast.loading("Deleting ICU Criterion...") }),
        onSuccess: async (_, __, variables) => {
            await qc.invalidateQueries({ queryKey: diseaseKeys.detail(diseaseId) });
            toast.success("ICU Criterion deleted successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}