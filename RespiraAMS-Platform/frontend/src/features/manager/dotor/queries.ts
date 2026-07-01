import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import logger from "@/lib/logger";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPagedDoctors } from "./api";

export function useInfiniteDoctors() {
    return useInfiniteQuery({
        queryKey: ["doctors", "infinite"],
        queryFn: ({ pageParam = 1 }) => getPagedDoctors(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.metadata.hasNext) {
                return lastPage.metadata.pageIndex + 1;
            }
            return undefined;
        },
    });
}