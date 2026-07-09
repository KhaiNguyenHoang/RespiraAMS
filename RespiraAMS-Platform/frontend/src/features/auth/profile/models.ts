export interface DoctorProfile {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    gender: boolean;
    dateOfBirth: string;
    citizenIdentificationCard: string;
    academicTitle: string;
    degree: string;
    degrees: string[];
    position: string;
    specialty: string;
    certificates: string[];
    educations: Array<{ title: string; school: string; year: string }>;
    mediaUrl?: string;
}

export interface ProfileFormState {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    position: string;
    academicTitle: string;
    citizenIdentificationCard: string;
    dateOfBirth: string;
    gender: boolean;
    degrees: string[];
}
