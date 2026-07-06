import { apiFetch, API_BASE } from "@/lib/api";
import { DoctorProfile } from "./models";

export async function getDoctorProfile(userId: string): Promise<DoctorProfile> {
    const data = await apiFetch<Record<string, unknown>>(
        `${API_BASE}/Profile/doctor/${userId}`
    );
    return mapDoctorProfile(data ?? {});
}

export async function updateDoctorProfile(
    userId: string,
    formData: FormData
): Promise<void> {
    await apiFetch(`${API_BASE}/Profile/update/doctor/${userId}`, {
        method: "PUT",
        body: formData,
    });
}

const normalizeAcademicTitle = (value?: string) => {
    const normalized = value?.trim();
    if (!normalized) return "None";
    const map: Record<string, string> = {
        none: "None",
        "associate professor": "AssociateProfessor",
        associateprofessor: "AssociateProfessor",
        "phó giáo sư": "AssociateProfessor",
        "giáo sư": "Professor",
        professor: "Professor",
    };
    return map[normalized.toLowerCase()] ?? normalized;
};

const normalizePosition = (value?: string) => {
    const normalized = value?.trim();
    if (!normalized) return "StaffDoctor";
    const map: Record<string, string> = {
        "staff doctor": "StaffDoctor",
        staffdoctor: "StaffDoctor",
        "senior doctor": "SeniorDoctor",
        seniordoctor: "SeniorDoctor",
        "department deputy head": "DepartmentDeputyHead",
        departmentdeputyhead: "DepartmentDeputyHead",
        "department head": "DepartmentHead",
        departmenthead: "DepartmentHead",
        "deputy director": "DeputyDirector",
        deputydirector: "DeputyDirector",
        director: "Director",
        "trưởng khoa nội tổng quát": "DepartmentHead",
        "trưởng khoa": "DepartmentHead",
        "phó giám đốc": "DeputyDirector",
        "giám đốc": "Director",
    };
    return map[normalized.toLowerCase()] ?? normalized;
};

export function normalizeProfilePayload(values: {
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
}) {
    return {
        ...values,
        position: normalizePosition(values.position),
        academicTitle: normalizeAcademicTitle(values.academicTitle),
    };
}

const mapDoctorProfile = (data: Record<string, unknown>): DoctorProfile => ({
    firstName: (data.firstName as string) ?? "",
    lastName: (data.lastName as string) ?? "",
    email: (data.email as string) ?? "",
    phoneNumber: (data.phoneNumber as string) ?? "",
    address: (data.address as string) ?? "",
    gender: Boolean(data.gender),
    dateOfBirth: (data.dateOfBirth as string) ?? "",
    citizenIdentificationCard: (data.citizenIdentificationCard as string) ?? "",
    academicTitle: normalizeAcademicTitle((data.academicTitle as string) ?? ""),
    degree:
        Array.isArray(data.degrees) && (data.degrees as string[]).length > 0
            ? (data.degrees as string[]).join(", ")
            : "",
    degrees: Array.isArray(data.degrees) ? (data.degrees as string[]) : [],
    position: normalizePosition((data.position as string) ?? ""),
    specialty: "",
    certificates: Array.isArray(data.certificates)
        ? (data.certificates as string[])
        : [],
    educations: Array.isArray(data.educations)
        ? (data.educations as Array<{ title: string; school: string; year: string }>)
        : [],
    mediaUrl: (data.mediaUrl as string) ?? undefined,
});
