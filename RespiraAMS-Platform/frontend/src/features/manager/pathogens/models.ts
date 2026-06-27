import { PaginationParam } from "@/lib/models";

export interface CreatePathogenRequest {
    name: string;
    description: string;
}

export interface PathogenItem {
    id: string;
    name: string;
    description: string;
}

export interface UpdatePathogenRequest {
    id: string;
    name: string;
    description: string;
}

export interface GetPathogensParams extends PaginationParam {
    name?: string;
}

export interface CreatePathogenResult {
    id: string;
}