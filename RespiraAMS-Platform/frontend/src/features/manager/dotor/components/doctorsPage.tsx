"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DoctorsTable } from "./doctorsTable";
import { DoctorItem } from "../models";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import DoctorForm from "./doctorForm";
import DeleteDoctorPanel from "./deleteDoctorPanel";
import { useCreateDoctor, useDeleteDoctor } from "../queries";

type ActiveView = "create" | "delete" | null;

export default function DoctorsManagementPage() {
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorItem | null>(null);

    const createMutation = useCreateDoctor();
    const deleteMutation = useDeleteDoctor();

    const openView = (view: ActiveView, item?: DoctorItem) => {
        setSelectedDoctor(item ?? null);
        setActiveView(view);
    };

    const closeView = () => {
        setActiveView(null);
        setSelectedDoctor(null);
    };

    const isDialogOpen = activeView === "create";
    const isSheetOpen = activeView === "delete";

    return (
        <div className="container mx-auto pb-10 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Doctors Management</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage doctor profiles, accounts, and system access.</p>
                </div>
                <Button onClick={() => openView("create")} className="gap-2 bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4" /> Add Doctor
                </Button>
            </div>

            <DoctorsTable 
                onEdit={() => console.log("Update functionality skipped per request")} 
                onDelete={(doctor) => openView("delete", doctor)} 
            />

            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                {/* Custom styling cho Dialog để giấu header mặc định */}
                <DialogContent className="p-0 border-none bg-transparent shadow-none [&>button]:hidden max-w-2xl lg:max-w-4xl">
                    <div className="hidden">
                        <DialogHeader>
                            <DialogTitle>Create Doctor Modal</DialogTitle>
                            <DialogDescription>Modal for creating a doctor</DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col bg-white">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-700">Create Doctor Account</h2>
                            <p className="text-xs text-zinc-500 mt-1">Fill in the required information to create a new doctor profile.</p>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <DoctorForm
                                onSubmit={(data) => createMutation.mutate(data, { onSuccess: closeView })}
                                onCancel={closeView}
                                isPending={createMutation.isPending}
                                error={createMutation.error}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete Doctor Profile</SheetTitle>
                        <SheetDescription>
                            Are you sure you want to delete this doctor? This action will revoke their access to the system.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-4 mt-4">
                        {activeView === "delete" && selectedDoctor && (
                            <DeleteDoctorPanel 
                                doctor={selectedDoctor}
                                onConfirm={() => deleteMutation.mutate(selectedDoctor.id, { onSuccess: closeView })}
                                onCancel={closeView}
                                isPending={deleteMutation.isPending}
                                error={deleteMutation.error}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>

        </div>
    );
}