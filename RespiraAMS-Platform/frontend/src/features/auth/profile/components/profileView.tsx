"use client";

import { type FormEvent, useEffect, useState, useRef } from "react";
import { Eye, EyeOff, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUser, saveUser, getAccessToken } from "@/lib/auth";
import { DoctorProfile, ProfileFormState } from "../models";
import { getDoctorProfile, updateDoctorProfile, normalizeProfilePayload } from "../api";

const academicTitleOptions = [
    { value: "None", label: "None" },
    { value: "AssociateProfessor", label: "Associate Professor" },
    { value: "Professor", label: "Professor" },
];

const positionOptions = [
    { value: "StaffDoctor", label: "Staff Doctor" },
    { value: "SeniorDoctor", label: "Senior Doctor" },
    { value: "DepartmentDeputyHead", label: "Department Deputy Head" },
    { value: "DepartmentHead", label: "Department Head" },
    { value: "DeputyDirector", label: "Deputy Director" },
    { value: "Director", label: "Director" },
];

const degreeOptions = [
    { value: "Doctor", label: "Doctor" },
    { value: "SpecialistLevel1", label: "Specialist Level 1" },
    { value: "SpecialistLevel2", label: "Specialist Level 2" },
    { value: "Master", label: "Master" },
    { value: "PhD", label: "PhD" },
    { value: "AssociateProfessor", label: "Associate Professor" },
    { value: "Professor", label: "Professor" },
];

const defaultDoctor: DoctorProfile = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    gender: false,
    dateOfBirth: "",
    citizenIdentificationCard: "",
    academicTitle: "",
    degree: "",
    degrees: [],
    position: "",
    specialty: "",
    certificates: [],
    educations: [],
};

const formatDate = (value: string) => {
    if (!value) return "Chưa cập nhật";
    try {
        return new Date(value).toLocaleDateString("vi-VN");
    } catch {
        return value;
    }
};

const maskValue = (value: string) => {
    if (!value) return "Chưa cập nhật";
    return "*".repeat(Math.max(8, value.length));
};

export default function ProfileView() {
    const [doctor, setDoctor] = useState<DoctorProfile>(defaultDoctor);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showEmail, setShowEmail] = useState(false);
    const [showCccd, setShowCccd] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [form, setForm] = useState<ProfileFormState>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        position: "",
        academicTitle: "",
        citizenIdentificationCard: "",
        dateOfBirth: "",
        gender: false,
        degrees: [],
    });

    const fullName =
        [doctor.firstName, doctor.lastName].filter(Boolean).join(" ") ||
        "Chưa cập nhật";
    const dob = formatDate(doctor.dateOfBirth);

    useEffect(() => {
        const loadProfile = async () => {
            const user = getUser();
            const token = getAccessToken();

            if (!user?.id || !token) {
                setError("Vui lòng đăng nhập để xem hồ sơ.");
                setIsLoading(false);
                return;
            }

            try {
                setError(null);
                const profile = await getDoctorProfile(user.id);
                setDoctor(profile);
                setForm({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    phoneNumber: profile.phoneNumber,
                    address: profile.address,
                    position: profile.position,
                    academicTitle: profile.academicTitle,
                    citizenIdentificationCard: profile.citizenIdentificationCard,
                    dateOfBirth: profile.dateOfBirth,
                    gender: profile.gender,
                    degrees: profile.degrees,
                });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Không thể tải hồ sơ."
                );
            } finally {
                setIsLoading(false);
            }
        };

        void loadProfile();
    }, []);

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Vui lòng chọn tệp hình ảnh hợp lệ.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Kích thước ảnh không được vượt quá 5MB.");
            return;
        }

        const user = getUser();
        const token = getAccessToken();

        if (!user?.id || !token) {
            setError("Vui lòng đăng nhập để cập nhật ảnh đại diện.");
            return;
        }

        const localPreviewUrl = URL.createObjectURL(file);

        try {
            setIsSaving(true);
            setError(null);

            setDoctor((prev) => ({
                ...prev,
                mediaUrl: localPreviewUrl,
            }));

            const normalizedPayload = normalizeProfilePayload({
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                email: doctor.email,
                phoneNumber: doctor.phoneNumber,
                address: doctor.address,
                position: doctor.position,
                academicTitle: doctor.academicTitle,
                citizenIdentificationCard: doctor.citizenIdentificationCard,
                dateOfBirth: doctor.dateOfBirth,
                gender: doctor.gender,
                degrees: doctor.degrees,
            });

            const formData = new FormData();
            formData.append("FirstName", normalizedPayload.firstName);
            formData.append("LastName", normalizedPayload.lastName);
            formData.append("Email", normalizedPayload.email);
            formData.append("PhoneNumber", normalizedPayload.phoneNumber);
            formData.append("Address", normalizedPayload.address);
            formData.append("Position", normalizedPayload.position);
            formData.append("AcademicTitle", normalizedPayload.academicTitle);
            formData.append(
                "CitizenIdentificationCard",
                normalizedPayload.citizenIdentificationCard
            );
            formData.append("DateOfBirth", normalizedPayload.dateOfBirth);
            formData.append("Gender", String(normalizedPayload.gender));
            normalizedPayload.degrees.forEach((deg) =>
                formData.append("Degrees", deg)
            );
            formData.append("Avatar", file);

            await updateDoctorProfile(user.id, formData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Cập nhật ảnh đại diện thất bại."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const openEdit = () => {
        setForm({
            firstName: doctor.firstName,
            lastName: doctor.lastName,
            email: doctor.email,
            phoneNumber: doctor.phoneNumber,
            address: doctor.address,
            position: doctor.position,
            academicTitle: doctor.academicTitle,
            citizenIdentificationCard: doctor.citizenIdentificationCard,
            dateOfBirth: doctor.dateOfBirth,
            gender: doctor.gender,
            degrees: doctor.degrees,
        });
        setIsEditOpen(true);
    };

    const handleChange =
        (field: keyof ProfileFormState) =>
        (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            if (field === "gender") {
                setForm((prev) => ({
                    ...prev,
                    gender: event.target.value === "true",
                }));
                return;
            }
            setForm((prev) => ({ ...prev, [field]: event.target.value }));
        };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const user = getUser();
        const token = getAccessToken();

        if (!user?.id || !token) {
            setError("Vui lòng đăng nhập để cập nhật hồ sơ.");
            return;
        }

        try {
            setIsSaving(true);
            setError(null);

            const payload = normalizeProfilePayload(form);

            const formData = new FormData();
            formData.append("FirstName", payload.firstName);
            formData.append("LastName", payload.lastName);
            formData.append("Email", payload.email);
            formData.append("PhoneNumber", payload.phoneNumber);
            formData.append("Address", payload.address);
            formData.append("Position", payload.position);
            formData.append("AcademicTitle", payload.academicTitle);
            formData.append(
                "CitizenIdentificationCard",
                payload.citizenIdentificationCard
            );
            formData.append("DateOfBirth", payload.dateOfBirth);
            formData.append("Gender", String(payload.gender));
            payload.degrees.forEach((deg) => formData.append("Degrees", deg));

            await updateDoctorProfile(user.id, formData);

            setDoctor((prev) => ({
                ...prev,
                ...payload,
                degree: payload.degrees.join(", "),
            }));

            saveUser({
                ...user,
                firstName: payload.firstName,
                lastName: payload.lastName,
                phoneNumber: payload.phoneNumber,
            });

            setIsEditOpen(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Cập nhật hồ sơ thất bại."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#003461]">
                        Thông tin Bác sĩ
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Xem và quản lý thông tin chứng chỉ hành nghề và thông
                        tin cá nhân của bác sĩ.
                    </p>
                </div>

                <Button
                    type="button"
                    className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0A3D73] px-6 text-white font-medium hover:bg-[#0D4D8C]"
                    onClick={openEdit}
                >
                    <Pencil size={16} />
                    Chỉnh sửa
                </Button>
            </div>

            <div className="mt-4 border-b-2 border-gray-200"></div>

            {error && (
                <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-500">
                    Đang tải thông tin hồ sơ...
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-12 gap-6">
                    <div className="col-span-4">
                        <div className="h-full rounded-md border-2 bg-white p-6">
                            <div className="flex flex-col items-center">
                                <div className="relative h-28 w-28">
                                    {doctor.mediaUrl ? (
                                        <img
                                            src={doctor.mediaUrl}
                                            alt="Doctor Avatar"
                                            className="h-full w-full rounded-md object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-md bg-slate-200 text-4xl font-bold">
                                            {doctor.firstName
                                                ? doctor.firstName
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : "N"}
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="absolute right-0 bottom-0 translate-x-1 translate-y-1 h-8 w-8 rounded-full border-2 border-white bg-white hover:bg-slate-100 shadow-sm flex items-center justify-center cursor-pointer transition-colors"
                                        title="Đổi ảnh đại diện"
                                    >
                                        <img
                                            src="/ButtonAvatar.png"
                                            alt="Edit Avatar Icon"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>

                                <h2 className="mt-6 text-xl font-semibold">
                                    BS. {fullName}
                                </h2>

                                <div className="my-5 w-full border-b-2"></div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[#003461]">
                                    Thông tin cá nhân
                                </h3>

                                <div className="grid gap-4 text-sm sm:grid-cols-2">
                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            Ngày sinh
                                        </div>
                                        <div>{dob}</div>
                                    </div>

                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            Giới tính
                                        </div>
                                        <div>
                                            {doctor.gender ? "Nam" : "Nữ"}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            CCCD
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                {showCccd
                                                    ? doctor.citizenIdentificationCard ||
                                                      "Chưa cập nhật"
                                                    : maskValue(
                                                          doctor.citizenIdentificationCard
                                                      )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCccd((v) => !v)
                                                }
                                                className="text-gray-500 hover:text-gray-700"
                                                aria-label={
                                                    showCccd
                                                        ? "Ẩn CCCD"
                                                        : "Hiện CCCD"
                                                }
                                            >
                                                {showCccd ? (
                                                    <EyeOff size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            Số điện thoại
                                        </div>
                                        <div>{doctor.phoneNumber}</div>
                                    </div>

                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            Email
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>
                                                {showEmail
                                                    ? doctor.email ||
                                                      "Chưa cập nhật"
                                                    : maskValue(doctor.email)}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowEmail((v) => !v)
                                                }
                                                className="text-gray-500 hover:text-gray-700"
                                                aria-label={
                                                    showEmail
                                                        ? "Ẩn email"
                                                        : "Hiện email"
                                                }
                                            >
                                                {showEmail ? (
                                                    <EyeOff size={14} />
                                                ) : (
                                                    <Eye size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <div className="text-xs uppercase text-gray-500">
                                            Địa chỉ thường trú
                                        </div>
                                        <div>{doctor.address}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-8 space-y-6">
                        <section className="rounded-md border-2 bg-white p-6">
                            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#003461]">
                                <img
                                    src="/hat.png"
                                    className="h-6 w-6"
                                    alt=""
                                />
                                Trình độ chuyên môn & Đào tạo
                            </h2>

                            <div className="mb-6 border-b-2"></div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-md border border-gray-200 bg-slate-50 p-4">
                                    <div className="text-xs uppercase tracking-wide text-gray-500">
                                        Chức vụ
                                    </div>
                                    <div className="mt-2 font-medium text-[#003461]">
                                        {doctor.position || "Chưa cập nhật"}
                                    </div>
                                </div>

                                <div className="rounded-md border border-gray-200 bg-slate-50 p-4">
                                    <div className="text-xs uppercase tracking-wide text-gray-500">
                                        Học hàm
                                    </div>
                                    <div className="mt-2 font-medium text-[#003461]">
                                        {doctor.academicTitle ||
                                            "Chưa cập nhật"}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="mb-3 font-medium">
                                    Học vị, bằng cấp
                                </h3>

                                <div className="grid gap-3 md:grid-cols-2">
                                    {doctor.degrees.length > 0
                                        ? doctor.degrees.map((degree) => (
                                              <div
                                                  key={degree}
                                                  className="rounded-md border border-gray-200 bg-slate-50 p-4"
                                              >
                                                  <div className="font-medium text-[#003461]">
                                                      {degree}
                                                  </div>
                                              </div>
                                          ))
                                        : (
                                        <div className="rounded-md border border-gray-200 bg-slate-50 p-4 text-sm text-gray-500">
                                            Chưa cập nhật
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex flex-wrap gap-2">
                                    {doctor.certificates.map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-2 rounded border-2 border-gray-300 bg-gray-50 px-3 py-1 text-sm"
                                        >
                                            <img
                                                src="/tick.png"
                                                alt="Tick"
                                                className="h-4 w-4"
                                            />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}

            {isEditOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setIsEditOpen(false)}
                >
                    <div
                        className="w-full max-w-5xl rounded-xl border bg-white p-5 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-[#003461]">
                                Chỉnh sửa hồ sơ
                            </h2>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Họ
                                    </label>
                                    <Input
                                        value={form.firstName}
                                        onChange={handleChange("firstName")}
                                        placeholder="Họ"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Tên
                                    </label>
                                    <Input
                                        value={form.lastName}
                                        onChange={handleChange("lastName")}
                                        placeholder="Tên"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Số điện thoại
                                    </label>
                                    <Input
                                        value={form.phoneNumber}
                                        onChange={handleChange("phoneNumber")}
                                        placeholder="Số điện thoại"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Địa chỉ
                                    </label>
                                    <Input
                                        value={form.address}
                                        onChange={handleChange("address")}
                                        placeholder="Địa chỉ thường trú"
                                    />
                                </div>
                            </div>

                            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            Email
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {form.email || "Chưa cập nhật"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            CCCD
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {form.citizenIdentificationCard ||
                                                "Chưa cập nhật"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs uppercase text-gray-500">
                                            Ngày sinh
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            {form.dateOfBirth
                                                ? new Date(
                                                      form.dateOfBirth
                                                  ).toLocaleDateString("vi-VN")
                                                : "Chưa cập nhật"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Chức vụ
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={form.position}
                                        onChange={handleChange("position")}
                                    >
                                        <option value="">
                                            Chọn chức vụ
                                        </option>
                                        {positionOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Học hàm
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={form.academicTitle}
                                        onChange={handleChange("academicTitle")}
                                    >
                                        <option value="">
                                            Chọn học hàm
                                        </option>
                                        {academicTitleOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Giới tính
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={form.gender ? "true" : "false"}
                                        onChange={handleChange("gender")}
                                    >
                                        <option value="true">Nam</option>
                                        <option value="false">Nữ</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase text-gray-500">
                                        Học vị / Bằng cấp
                                    </label>
                                    <div className="space-y-2 rounded-md border border-gray-200 p-3">
                                        <label className="mb-2 block text-xs uppercase text-gray-500">
                                            Chọn học vị
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {degreeOptions.map((option) => {
                                                const checked =
                                                    form.degrees.includes(
                                                        option.value
                                                    );
                                                return (
                                                    <label
                                                        key={option.value}
                                                        className="flex cursor-pointer items-center gap-2 rounded-full border border-gray-300 px-3 py-1 text-sm"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() => {
                                                                setForm(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        degrees:
                                                                            checked
                                                                                ? prev.degrees.filter(
                                                                                      (item) =>
                                                                                          item !==
                                                                                          option.value
                                                                                  )
                                                                                : [
                                                                                      ...prev.degrees,
                                                                                      option.value,
                                                                                  ],
                                                                    })
                                                                );
                                                            }}
                                                        />
                                                        <span>
                                                            {option.label}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSaving}>
                                    {isSaving ? "Đang lưu..." : "Lưu"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
