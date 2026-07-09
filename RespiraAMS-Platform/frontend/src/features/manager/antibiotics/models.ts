import { PaginationParam } from "@/lib/models";

export enum AwareCategory {
    Access = "Access",
    AccessWatch = "AccessWatch",
    Watch = "Watch",
    Reserve = "Reserve",
    Others = "Others",
    Unclassified = "Unclassified",
}

export interface CreateAntibioticRequest {
    name: string;
    antibioticSpectrumId: string;
    category: AwareCategory;
    dosages: Record<string, string[]>;
}

export interface CreateAntibioticResult {
    id: string;
}

export interface AntibioticItem {
    id: string;
    name: string;
    antibioticSpectrum: {
        id: string;
        name: string;
        description: string;
    };
    category: AwareCategory | string;
    routeOfAdministrations: string[];
    dosages: Record<string, string[]>;
}

export interface UpdateAntibioticRequest {
    id: string;
    name: string;
    antibioticSpectrumId: string;
    category: AwareCategory;
    dosages: Record<string, string[]>;
}

export interface GetAntibioticsParams extends PaginationParam {
    name?: string;
    antibioticSpectrumId?: string;
    category?: AwareCategory | string;
}