import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAntibioticSpectrum, deleteAntibioticSpectrum, getAntibioticSpectra, updateAntibioticSpectrum } from "./api";
import { CreateAntibioticSpectrumRequest, GetAntibioticSpectraParams, UpdateAntibioticSpectrumRequest } from "./models";
import { toast } from "sonner";
import logger from "@/lib/logger";

/**
 * Key for TanStack Query to cache data if the same query is performed
 */
export const antibioticSpectrumKeys = {
    all: ["antibiotic-spectra"] as const,
    list: (params: GetAntibioticSpectraParams) => ["antibiotic-spectra", "list", params] as const,
}

export function useAntibioticSpectra(params: GetAntibioticSpectraParams) {
    return useQuery({
        queryKey: antibioticSpectrumKeys.list(params),
        queryFn: () => getAntibioticSpectra(params),
    });
}

export function useCreateAntibioticSpectrum() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: CreateAntibioticSpectrumRequest) => createAntibioticSpectrum(req),
        onMutate: () => {
            const id = toast.loading("Create antibiotic spectrum...");
            return { toastID: id }
        },
        onSuccess: async (response, __, variables) => {
            logger.info(`Created antibiotic spectrum successfully: ${response.id}`)

            await qc.invalidateQueries({ queryKey: antibioticSpectrumKeys.all })

            toast.success("Antibiotic spectrum created successfully!");
            toast.dismiss(variables.toastID);

        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error("Failed to create antibiotic spectrum");
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useUpdateAntibioticSpectrum() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (req: UpdateAntibioticSpectrumRequest) => updateAntibioticSpectrum(req),
        onMutate: () => {
            const id = toast.loading("Update antibiotic spectrum...");
            return { toastID: id }
        },
        onSuccess: async (_, __, variables) => {
            logger.info(`Update antibiotic spectrum successfully`)

            await qc.invalidateQueries({ queryKey: antibioticSpectrumKeys.all })

            toast.success("Antibiotic spectrum updated successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error("Failed to update antibiotic spectrum");
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteAntibioticSpectrum() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAntibioticSpectrum(id),
        onMutate: () => {
            const id = toast.loading("Delete antibiotic spectrum...");
            return { toastID: id }
        },
        onSuccess: async (_, __, variables) => {
            logger.info(`Delete antibiotic spectrum successfully`)

            await qc.invalidateQueries({ queryKey: antibioticSpectrumKeys.all })

            toast.success("Antibiotic spectrum deleted successfully!");
            toast.dismiss(variables.toastID);
        },
        onError: (error, _, variables) => {
            logger.error(error.message);
            toast.error("Failed to delete antibiotic spectrum");
            toast.dismiss(variables?.toastID);
        }
    });
}

import { getAntibioticSpectraList } from "./api";

export function useAntibioticSpectraList() {
    return useQuery({
        queryKey: ["antibiotic-spectra", "list-all"],
        queryFn: getAntibioticSpectraList,
    });
}