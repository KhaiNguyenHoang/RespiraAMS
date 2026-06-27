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

type SheetView = "create" | "update" | "delete" | "view" | null;

export function DiseasesPage() {
    const [sheetView, setSheetView] = useState<SheetView>(null);
    const [selectedDisease, setSelectedDisease] = useState<DiseaseItem | null>(null);

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

    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Diseases Management</h1>
                <Button onClick={() => openSheet("create")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Disease
                </Button>
            </div>

            <DiseasesTable
                onView={(item) => openSheet("view", item)}
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
                            {sheetView === "view" && "Disease Details"}
                        </SheetTitle>
                        <SheetDescription>
                            {sheetView === "create" && "Fill out the information below to create a new disease."}
                            {sheetView === "update" && "Modify the details of this disease."}
                            {sheetView === "delete" && "Confirm deletion of this record."}
                            {sheetView === "view" && "Viewing detailed information."}
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
                                onConfirm={() => deleteMutation.mutate(selectedDisease.id, { onSuccess: closeSheet })}
                                onCancel={closeSheet}
                                isPending={deleteMutation.isPending}
                                error={deleteMutation.error}
                            />
                        )}

                        {/* Placeholder cho View Details mốt bồ đắp code vô */}
                        {sheetView === "view" && selectedDisease && (
                            <div className="space-y-4">
                                <div className="p-4 border rounded-md bg-zinc-50">
                                    <p className="text-sm font-semibold text-zinc-500">ID</p>
                                    <p className="text-base break-all">{selectedDisease.id}</p>
                                </div>
                                <div className="p-4 border rounded-md bg-zinc-50">
                                    <p className="text-sm font-semibold text-zinc-500">Name</p>
                                    <p className="text-base text-primary font-medium">{selectedDisease.name}</p>
                                </div>
                                <div className="p-4 border rounded-md bg-zinc-50">
                                    <p className="text-sm font-semibold text-zinc-500">Description</p>
                                    <p className="text-sm text-zinc-700 mt-1 whitespace-pre-wrap leading-relaxed">
                                        {selectedDisease.description}
                                    </p>
                                </div>
                                <div className="p-4 border border-dashed rounded-md bg-zinc-100 flex items-center justify-center text-zinc-400 h-32">
                                    [Future View Details Implementation goes here]
                                </div>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}