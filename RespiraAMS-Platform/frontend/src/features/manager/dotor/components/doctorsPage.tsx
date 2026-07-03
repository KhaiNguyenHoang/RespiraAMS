"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DoctorsTable } from "./doctorsTable";
import { DoctorItem } from "../models";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import DoctorForm from "./doctorForm";
import DeleteDoctorPanel from "./deleteDoctorPanel";
import { useCreateDoctor, useDeleteDoctor } from "../queries";

type ModalView = "create" | "delete" | null;

export default function DoctorsManagementPage() {
    const [modalView, setModalView] = useState<ModalView>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);

    const createMutation = useCreateDoctor();
    const deleteMutation = useDeleteDoctor();

    const closeModal = () => {
        setModalView(null);
        setSelectedDoctor(null);
    };

    return (
        <div className="container mx-auto pb-10 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Doctors Management</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage doctor profiles, accounts, and system access.</p>
                </div>
                <Button onClick={() => setModalView("create")} className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" /> Add Doctor
                </Button>
            </div>

            <DoctorsTable 
                onEdit={() => console.log("Update functionality skipped per request")} 
                onDelete={(doctor) => {
                    setSelectedDoctor(doctor);
                    setModalView("delete");
                }} 
            />

            {/* XÀI CHUNG 1 CÁI DIALOG CHO GỌN NHẸ */}
            <Dialog open={modalView !== null} onOpenChange={(open) => { if (!open) closeModal(); }}>
                {/* Nếu form Create thì nới rộng max-w-4xl (cho 2 cột thở), còn Delete thì max-w-md thôi.
                    Làm mất nút X mặc định và viền mờ bằng: p-0 border-none bg-transparent shadow-none [&>button]:hidden 
                */}
                <DialogContent className={`p-0 border-none bg-transparent shadow-none [&>button]:hidden ${modalView === "create" ? "max-w-2xl lg:max-w-4xl" : "max-w-md"}`}>
                    
                    {/* Giấu cái Header mặc định của Shadcn đi để mình tự vẽ cho đẹp */}
                    <div className="hidden">
                        <DialogHeader>
                            <DialogTitle>Doctor Modal</DialogTitle>
                            <DialogDescription>Modal for creating or deleting a doctor</DialogDescription>
                        </DialogHeader>
                    </div>

                    {/* GIAO DIỆN MODAL CREATE */}
                    {modalView === "create" && (
                        <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col bg-white">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="text-lg font-bold text-gray-700">Create Doctor Account</h2>
                                <p className="text-xs text-zinc-500 mt-1">Fill in the required information to create a new doctor profile.</p>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <DoctorForm
                                    onSubmit={(data) => createMutation.mutate(data, { onSuccess: closeModal })}
                                    onCancel={closeModal}
                                    isPending={createMutation.isPending}
                                    error={createMutation.error}
                                />
                            </div>
                        </div>
                    )}

                    {/* GIAO DIỆN MODAL DELETE */}
                    {modalView === "delete" && selectedDoctor && (
                        <div className="bg-white rounded-md overflow-hidden flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 bg-red-50/50">
                                <h2 className="text-lg font-bold text-red-600">Delete Doctor Profile</h2>
                            </div>
                            <div className="p-6">
                                <DeleteDoctorPanel 
                                    doctor={selectedDoctor}
                                    onConfirm={() => deleteMutation.mutate(selectedDoctor.id, { onSuccess: closeModal })}
                                    onCancel={closeModal}
                                    isPending={deleteMutation.isPending}
                                    error={deleteMutation.error}
                                />
                            </div>
                        </div>
                    )}

                </DialogContent>
            </Dialog>
        </div>
    );
}