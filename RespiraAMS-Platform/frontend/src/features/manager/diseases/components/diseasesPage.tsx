"use client"

import { useState } from "react";
import { useCreateDisease, useUpdateDisease, useDeleteDisease } from "../queries";
import { DiseaseItem } from "../models";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { DiseasesTable } from "./diseasesTable";
import DiseaseForm from "./diseaseForm";
import DeleteDiseasePanel from "./deleteDiseasePanel";

import DiseaseDetailView from "./diseaseDetailPage";

type SheetView = "create" | "update" | "delete" | null;

export function DiseasesPage() {
    const [sheetView, setSheetView] = useState<SheetView>(null);
    const [selectedDisease, setSelectedDisease] = useState<DiseaseItem | null>(null);
    
    const [viewingDetailId, setViewingDetailId] = useState<string | null>(null);

    const createMutation = useCreateDisease();
    const updateMutation = useUpdateDisease();
    const deleteMutation = useDeleteDisease();

    const openSheet = (view: SheetView, item?: DiseaseItem) => {
        setSelectedDisease(item ?? null);
        setSheetView(view);
    };

    const closeSheet = () => {
        setSheetView(null);
        setSelectedDisease(null);
    };

    const isSheetOpen = sheetView !== null;

    if (viewingDetailId) {
        return (
            <div className="container mx-auto">
                <DiseaseDetailView 
                    id={viewingDetailId} 
                    onBack={() => setViewingDetailId(null)} 
                    onEditDisease={(disease) => openSheet("update", disease)}
                    onDeleteDisease={(disease) => openSheet("delete", disease)}
                />

                <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); }}>
                    <SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>
                                {sheetView === "update" && "Update Disease"}
                                {sheetView === "delete" && "Delete Disease"}
                            </SheetTitle>
                            <SheetDescription>
                                {sheetView === "update" && "Modify the details of this disease."}
                                {sheetView === "delete" && "Confirm deletion of this record."}
                            </SheetDescription>
                        </SheetHeader>

                        <div className="p-4 mt-2">
                            {(sheetView === "create" || (sheetView === "update" && selectedDisease)) && (
                                <DiseaseForm
                                    initialData={sheetView === "update" ? selectedDisease : null}
                                    onSubmit={(data) => {
                                        if (sheetView === "create") {
                                            createMutation.mutate(data, { onSuccess: closeSheet });
                                        } else if (sheetView === "update" && selectedDisease) {
                                            updateMutation.mutate({ id: selectedDisease.id, ...data }, { onSuccess: closeSheet });
                                        }
                                    }}
                                    onCancel={closeSheet}
                                    isPending={createMutation.isPending || updateMutation.isPending}
                                    error={createMutation.error || updateMutation.error}
                                />
                            )}

                            {sheetView === "delete" && selectedDisease && (
                                <DeleteDiseasePanel
                                    disease={selectedDisease}
                                    onConfirm={() => deleteMutation.mutate(selectedDisease.id, { 
                                        onSuccess: () => {
                                            closeSheet();
                                            setViewingDetailId(null);
                                        }
                                    })}
                                    onCancel={closeSheet}
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

    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Diseases Management</h1>
                <Button onClick={() => openSheet("create")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Disease
                </Button>
            </div>

            <DiseasesTable
                onView={(item) => setViewingDetailId(item.id)}
                onEdit={(item) => openSheet("update", item)}
                onDelete={(item) => openSheet("delete", item)}
            />

            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); }}>
                <SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle>
                            {sheetView === "create" && "Create New Disease"}
                            {sheetView === "update" && "Update Disease"}
                            {sheetView === "delete" && "Delete Disease"}
                        </SheetTitle>
                        <SheetDescription>
                            {sheetView === "create" && "Fill out the information below to create a new disease."}
                            {sheetView === "update" && "Modify the details of this disease."}
                            {sheetView === "delete" && "Confirm deletion of this record."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-4 mt-2">
                        {(sheetView === "create" || (sheetView === "update" && selectedDisease)) && (
                            <DiseaseForm
                                initialData={sheetView === "update" ? selectedDisease : null}
                                onSubmit={(data) => {
                                    if (sheetView === "create") {
                                        createMutation.mutate(data, { onSuccess: closeSheet });
                                    } else if (sheetView === "update" && selectedDisease) {
                                        updateMutation.mutate({ id: selectedDisease.id, ...data }, { onSuccess: closeSheet });
                                    }
                                }}
                                onCancel={closeSheet}
                                isPending={createMutation.isPending || updateMutation.isPending}
                                error={createMutation.error || updateMutation.error}
                            />
                        )}

                        {sheetView === "delete" && selectedDisease && (
                            <DeleteDiseasePanel
                                disease={selectedDisease}
                                onConfirm={() => deleteMutation.mutate(selectedDisease.id, { 
                                    onSuccess: () => {
                                        closeSheet();
                                        setViewingDetailId(null);
                                    }
                                })}
                                onCancel={closeSheet}
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