"use client"

import { useState } from "react";
import { useCreateDisease, useUpdateDisease, useDeleteDisease } from "../queries";
import { DiseaseItem } from "../models";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DiseasesTable } from "./diseasesTable";
import DiseaseForm from "./diseaseForm";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DeletePanel } from "../../shared/components/deletePanel";
import { TableTitle } from "../../shared/components/tableTitle";

type ActiveView = "create" | "update" | "delete" | null;

export function DiseasesPage() {
    const router = useRouter();
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const [selectedDisease, setSelectedDisease] = useState<DiseaseItem | null>(null);

    const createMutation = useCreateDisease();
    const updateMutation = useUpdateDisease();
    const deleteMutation = useDeleteDisease();

    const openView = (view: ActiveView, item?: DiseaseItem) => {
        setSelectedDisease(item ?? null);
        setActiveView(view);
    };

    const closeView = () => {
        setActiveView(null);
        setSelectedDisease(null);
    };

    const isDialogOpen = activeView === "create" || activeView === "update";
    const isSheetOpen = activeView === "delete";

    return (
        <div className="container mx-auto">
            <TableTitle title="Bệnh truyền nhiễm" onClick={() => openView("create")} />

            <DiseasesTable
                onView={(item) => router.push(`/manager/diseases/${item.id}`)}
                onEdit={(item) => openView("update", item)}
                onDelete={(item) => openView("delete", item)}
            />

            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {activeView === "create" && "Create New Disease"}
                            {activeView === "update" && "Update Disease"}
                        </DialogTitle>
                        <DialogDescription>
                            {activeView === "create" && "Fill out the information below to create a new disease."}
                            {activeView === "update" && "Modify the details of this disease."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        {(activeView === "create" || (activeView === "update" && selectedDisease)) && (
                            <DiseaseForm
                                initialData={activeView === "update" ? selectedDisease : null}
                                onSubmit={(data) => {
                                    if (activeView === "create") {
                                        createMutation.mutate(data, { onSuccess: closeView });
                                    } else if (activeView === "update" && selectedDisease) {
                                        updateMutation.mutate({ id: selectedDisease.id, ...data }, { onSuccess: closeView });
                                    }
                                }}
                                onCancel={closeView}
                                isPending={createMutation.isPending || updateMutation.isPending}
                                error={createMutation.error || updateMutation.error}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete Disease</SheetTitle>
                        <SheetDescription>
                            Confirm deletion of this record. This action cannot be undone.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-4 mt-4">
                        {activeView === "delete" && selectedDisease && (
                            <DeletePanel
                                onConfirm={() => deleteMutation.mutate(selectedDisease.id, { onSuccess: () => closeView() })}
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