"use client"

import { useState } from "react";
import { useCreatePathogen, useUpdatePathogen, useDeletePathogen } from "../queries";
import { PathogenItem } from "../models";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { PathogensTable } from "./pathogensTable";
import PathogenForm from "./pathogenForm";
import DeletePathogenPanel from "./deletePathogenPanel";

type SheetView = "create" | "update" | "delete" | null;

export function PathogensPage() {
    const [sheetView, setSheetView] = useState<SheetView>(null);
    const [selectedPathogen, setSelectedPathogen] = useState<PathogenItem | null>(null);

    const createMutation = useCreatePathogen();
    const updateMutation = useUpdatePathogen();
    const deleteMutation = useDeletePathogen();

    const openSheet = (view: SheetView, item?: PathogenItem) => {
        setSelectedPathogen(item ?? null);
        setSheetView(view);
    };

    const closeSheet = () => {
        setSheetView(null);
        setSelectedPathogen(null);
    };

    const isSheetOpen = sheetView !== null;

    return (
        <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Pathogen Management</h1>
                <Button onClick={() => openSheet("create")}>
                    <Plus className="mr-2 h-4 w-4" /> Create
                </Button>
            </div>

            <PathogensTable
                onEdit={(item) => openSheet("update", item)}
                onDelete={(item) => openSheet("delete", item)}
            />

            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); }}>
                <SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[500px]">
                    <SheetHeader>
                        <SheetTitle>
                            {sheetView === "create" && "Create New Pathogen"}
                            {sheetView === "update" && "Update Pathogen"}
                            {sheetView === "delete" && "Delete Pathogen"}
                        </SheetTitle>
                        <SheetDescription>
                            {sheetView === "create" && "Fill in the information below to create a new entry."}
                            {sheetView === "update" && "Modify the pathogen name or description."}
                            {sheetView === "delete" && "Confirm pathogen deletion."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-4 mt-2">
                        {(sheetView === "create" || (sheetView === "update" && selectedPathogen)) && (
                            <PathogenForm
                                initialData={sheetView === "update" ? selectedPathogen : null}
                                onSubmit={(data) => {
                                    if (sheetView === "create") {
                                        createMutation.mutate(data, { onSuccess: closeSheet });
                                    } else if (sheetView === "update" && selectedPathogen) {
                                        updateMutation.mutate({ id: selectedPathogen.id, ...data }, { onSuccess: closeSheet });
                                    }
                                }}
                                onCancel={closeSheet}
                                isPending={createMutation.isPending || updateMutation.isPending}
                                error={createMutation.error || updateMutation.error}
                            />
                        )}

                        {sheetView === "delete" && selectedPathogen && (
                            <DeletePathogenPanel
                                pathogen={selectedPathogen}
                                onConfirm={() => deleteMutation.mutate(selectedPathogen.id, { onSuccess: closeSheet })}
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