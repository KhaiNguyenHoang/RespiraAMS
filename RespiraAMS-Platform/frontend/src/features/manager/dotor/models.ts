export interface DoctorItem {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    address: string;
    degrees: string[];
    academicTitle: string | null;
    citizenIdentificationCard: string;
    gender: boolean;
    dateOfBirth: string | null;
    position: string;
    mediaId: string | null;
    mediaUrl: string | null;
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
    items: DoctorItem[];
}