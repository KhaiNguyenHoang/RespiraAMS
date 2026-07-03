export interface StatisticsData {
    totalDecision: { severity: string; count: number }[];
    recommendationAccuracy: { month: number; accuracy: number }[];
    antibioticConsumptionRates: { category: string; count: number; rate: number }[];
}

export interface DoctorOption {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
}

export interface PagedDoctorResponse {
    metadata: {
        pageIndex: number;
        pageSize: number;
        totalItems: number;
        totalPages: number;
        hasPrevious: boolean;
        hasNext: boolean;
    };
    items: DoctorOption[];
}