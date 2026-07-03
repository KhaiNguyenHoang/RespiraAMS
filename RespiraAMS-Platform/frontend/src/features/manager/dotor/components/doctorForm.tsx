"use client"

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";

// Map Enums từ Backend
const AcademicTitleOptions = ["None", "AssociateProfessor", "Professor"];
const PositionOptions = ["StaffDoctor", "SeniorDoctor", "DepartmentDeputyHead", "DepartmentHead", "DeputyDirector", "Director"];
const DegreeOptions = ["Doctor", "SpecialistLevel1", "SpecialistLevel2", "Master", "PhD", "AssociateProfessor", "Professor"];

const doctorSchema = z.object({
    firstName: z.string().trim().min(1, "First Name is required!"),
    lastName: z.string().trim().min(1, "Last Name is required!"),
    email: z.string().trim().email("Invalid email format!"),
    password: z.string().min(6, "Password must be at least 6 characters!"),
    phoneNumber: z.string().trim().min(1, "Phone number is required!"),
    address: z.string().trim().min(1, "Address is required!"),
    citizenIdentificationCard: z.string().trim().min(1, "Citizen ID is required!"),
    dateOfBirth: z.string().min(1, "Date of Birth is required!"),
    gender: z.string().min(1, "Gender is required!"), // Nhận "true" / "false"
    academicTitle: z.string().min(1, "Academic Title is required!"),
    position: z.string().min(1, "Position is required!"),
});

interface DoctorFormProps {
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function DoctorForm({ onSubmit, onCancel, isPending, error: apiError }: DoctorFormProps) {
    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", password: "", phoneNumber: "", address: "",
        citizenIdentificationCard: "", dateOfBirth: "", gender: "true", academicTitle: "None", position: "StaffDoctor"
    });
    const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: "" }));
    };

    const toggleDegree = (degree: string) => {
        setSelectedDegrees(prev => 
            prev.includes(degree) ? prev.filter(d => d !== degree) : [...prev, degree]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = doctorSchema.safeParse(formData);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => errs[issue.path[0] as string] = issue.message);
            setFormErrors(errs);
            return;
        }
        
        setFormErrors({});

        // Gói vô FormData để gửi file
        const submitData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            // Ép kiểu DateOfBirth chuẩn ISO ISO 8601 mà Backend C# ăn được
            if (key === "dateOfBirth" && value) {
                const dateOffset = new Date(value).toISOString();
                submitData.append("DateOfBirth", dateOffset);
            } 
            else if (key === "gender") {
                submitData.append("Gender", value); // "true" or "false"
            } else {
                // Viết hoa chữ cái đầu cho đúng field name C# record Dto
                const csharpKey = key.charAt(0).toUpperCase() + key.slice(1);
                submitData.append(csharpKey, value);
            }
        });

        // Gửi mảng Degrees (FormData hỗ trợ append cùng tên key nhiều lần)
        selectedDegrees.forEach(degree => {
            submitData.append("Degrees", degree);
        });

        if (avatarFile) {
            submitData.append("Avatar", avatarFile);
        }

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in fade-in" noValidate>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">First Name <span className="text-red-500">*</span></label>
                    <Input value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} disabled={isPending} className={formErrors.firstName ? "border-red-500" : ""} />
                    {formErrors.firstName && <p className="text-xs text-red-500 mt-1">{formErrors.firstName}</p>}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name <span className="text-red-500">*</span></label>
                    <Input value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} disabled={isPending} className={formErrors.lastName ? "border-red-500" : ""} />
                    {formErrors.lastName && <p className="text-xs text-red-500 mt-1">{formErrors.lastName}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email <span className="text-red-500">*</span></label>
                    <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} disabled={isPending} className={formErrors.email ? "border-red-500" : ""} />
                    {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Password <span className="text-red-500">*</span></label>
                    <Input type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} disabled={isPending} className={formErrors.password ? "border-red-500" : ""} />
                    {formErrors.password && <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number <span className="text-red-500">*</span></label>
                    <Input value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)} disabled={isPending} className={formErrors.phoneNumber ? "border-red-500" : ""} />
                    {formErrors.phoneNumber && <p className="text-xs text-red-500 mt-1">{formErrors.phoneNumber}</p>}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Citizen ID (CCCD) <span className="text-red-500">*</span></label>
                    <Input value={formData.citizenIdentificationCard} onChange={(e) => handleInputChange("citizenIdentificationCard", e.target.value)} disabled={isPending} className={formErrors.citizenIdentificationCard ? "border-red-500" : ""} />
                    {formErrors.citizenIdentificationCard && <p className="text-xs text-red-500 mt-1">{formErrors.citizenIdentificationCard}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                    <Input type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange("dateOfBirth", e.target.value)} disabled={isPending} className={formErrors.dateOfBirth ? "border-red-500 text-red-500" : ""} />
                    {formErrors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{formErrors.dateOfBirth}</p>}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Gender <span className="text-red-500">*</span></label>
                    <select value={formData.gender} onChange={(e) => handleInputChange("gender", e.target.value)} disabled={isPending} className="flex h-[36px] w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        <option value="true">Male</option>
                        <option value="false">Female</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Address <span className="text-red-500">*</span></label>
                <Input value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} disabled={isPending} className={formErrors.address ? "border-red-500" : ""} />
                {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Academic Title <span className="text-red-500">*</span></label>
                    <select value={formData.academicTitle} onChange={(e) => handleInputChange("academicTitle", e.target.value)} disabled={isPending} className="flex h-[36px] w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        {AcademicTitleOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Position <span className="text-red-500">*</span></label>
                    <select value={formData.position} onChange={(e) => handleInputChange("position", e.target.value)} disabled={isPending} className="flex h-[36px] w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
                        {PositionOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* DEGREES MULTI-SELECT */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Degrees</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-zinc-50 p-3 rounded-md border">
                    {DegreeOptions.map(deg => (
                        <label key={deg} className="flex items-center gap-2 cursor-pointer text-sm">
                            <input 
                                type="checkbox" 
                                checked={selectedDegrees.includes(deg)} 
                                onChange={() => toggleDegree(deg)} 
                                disabled={isPending}
                                className="rounded text-primary focus:ring-primary"
                            />
                            {deg}
                        </label>
                    ))}
                </div>
            </div>

            {/* AVATAR FILE */}
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Avatar <span className="font-normal italic text-zinc-400">- Optional</span></label>
                <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setAvatarFile(e.target.files[0]);
                        } else {
                            setAvatarFile(null);
                        }
                    }} 
                    disabled={isPending} 
                    className="cursor-pointer bg-white pt-1.5" 
                />
            </div>

            {apiError && <p className="text-sm text-red-500 font-bold mt-2">{apiError.message}</p>}

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                <button type="button" onClick={onCancel} disabled={isPending} className="px-5 py-2 border border-gray-300 rounded-md text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-5 py-2 rounded-md text-sm font-bold text-white bg-primary hover:opacity-90 transition disabled:opacity-50">
                    {isPending ? "Creating..." : "Create Doctor"}
                </button>
            </div>
        </form>
    );
}