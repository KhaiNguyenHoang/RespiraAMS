import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { createPathogen, deletePathogen, getPathogens, updatePathogen } from "./api";
import { CreatePathogenRequest, GetPathogensParams, UpdatePathogenRequest } from "./models";

export const pathogenKeys = {
    all: ["pathogens"] as const,
    list: (params: GetPathogensParams) => ["pathogens", "list", params] as const,
};

export function usePathogens(params: GetPathogensParams) {
    return useQuery({
        queryKey: pathogenKeys.list(params),
        queryFn: () => getPathogens(params),
    });
}

export function useCreatePathogen() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: CreatePathogenRequest) => createPathogen(req),
        onMutate: () => ({ toastID: toast.loading("Creating pathogen...") }),
        onSuccess: async (_, __, variables) => {
            logger.info(`Create pathogen successfully`);
            await qc.invalidateQueries({ queryKey: pathogenKeys.all });
            toast.success("Pathogen created successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useUpdatePathogen() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: UpdatePathogenRequest) => updatePathogen(req),
        onMutate: () => ({ toastID: toast.loading("Updating pathogen...") }),
        onSuccess: async (_, __, variables) => {
            logger.info(`Update pathogen successfully`);
            await qc.invalidateQueries({ queryKey: pathogenKeys.all });
            toast.success("Pathogen updated successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeletePathogen() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deletePathogen(id),
        onMutate: () => ({ toastID: toast.loading("Deleting pathogen...") }),
        onSuccess: async (_, __, variables) => {
            logger.info(`Delete pathogen successfully`);
            await qc.invalidateQueries({ queryKey: pathogenKeys.all });
            toast.success("Pathogen deleted successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}