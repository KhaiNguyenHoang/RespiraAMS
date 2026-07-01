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