import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createDoctor, deleteDoctor, getDoctors } from "./api";

export const doctorKeys = {
    all: ["doctors"] as const,
    list: (page: number, pageSize: number) => [...doctorKeys.all, "list", page, pageSize] as const,
};

export function useDoctors(page: number, pageSize: number = 10) {
    return useQuery({
        queryKey: doctorKeys.list(page, pageSize),
        queryFn: () => getDoctors(page, pageSize),
    });
}

export function useCreateDoctor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => createDoctor(data),
        onMutate: () => {
            const toastID = toast.loading("Creating doctor profile...");
            return { toastID };
        },
        onSuccess: async (_, __, variables: any) => {
            await qc.invalidateQueries({ queryKey: doctorKeys.all });
            toast.success("Doctor created successfully!");
            toast.dismiss(variables?.toastID);
        },
        onError: (error, _, variables: any) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}

export function useDeleteDoctor() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteDoctor(id),
        onMutate: () => {
            const toastID = toast.loading("Deleting doctor...");
            return { toastID };
        },
        onSuccess: async (_, __, variables: any) => {
            await qc.invalidateQueries({ queryKey: doctorKeys.all });
            toast.success("Doctor deleted successfully!");
            toast.dismiss(variables?.toastID);
        },
        onError: (error, _, variables: any) => {
            toast.error(`Error: ${error.message}`);
            toast.dismiss(variables?.toastID);
        }
    });
}