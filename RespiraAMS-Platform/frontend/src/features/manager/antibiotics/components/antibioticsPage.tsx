"use client"

import { useState } from "react";
import { useCreateAntibiotic, useUpdateAntibiotic, useDeleteAntibiotic } from "../queries";
import { AntibioticItem } from "../models";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AntibioticsTable } from "./antibioticsTable";
import AntibioticForm from "./antibioticForm";
import DeleteAntibioticPanel from "./deleteAntibioticPanel";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type ActiveView = "create" | "update" | "delete" | null;

export function AntibioticsPage() {
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const [selectedAntibiotic, setSelectedAntibiotic] = useState<AntibioticItem | null>(null);

    const createMutation = useCreateAntibiotic();
    const updateMutation = useUpdateAntibiotic();
    const deleteMutation = useDeleteAntibiotic();

    const openView = (view: ActiveView, item?: AntibioticItem) => {
        setSelectedAntibiotic(item ?? null);
        setActiveView(view);
    };

    const closeView = () => {
        setActiveView(null);
        setSelectedAntibiotic(null);
    };

    const isDialogOpen = activeView === "create" || activeView === "update";
    const isSheetOpen = activeView === "delete";

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Antibiotics</h1>
                <Button onClick={() => openView("create")}>
                    <Plus className="mr-2" /> Create
                </Button>
            </div>

            <AntibioticsTable
                onEdit={(item) => openView("update", item)}
                onDelete={(item) => openView("delete", item)}
            />

            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {activeView === "create" && "Create New Antibiotic"}
                            {activeView === "update" && "Update Antibiotic"}
                        </DialogTitle>
                        <DialogDescription>
                            {activeView === "create" && "Fill in the information below to create a new entry."}
                            {activeView === "update" && "Modify the antibiotic details."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        {(activeView === "create" || (activeView === "update" && selectedAntibiotic)) && (
                            <AntibioticForm
                                initialData={activeView === "update" ? selectedAntibiotic : null}
                                onSubmit={(data) => {
                                    if (activeView === "create") {
                                        createMutation.mutate(data, { onSuccess: closeView });
                                    } else if (activeView === "update" && selectedAntibiotic) {
                                        updateMutation.mutate({ id: selectedAntibiotic.id, ...data }, { onSuccess: closeView });
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
                        <SheetTitle>Delete Antibiotic</SheetTitle>
                        <SheetDescription>
                            Are you sure you want to delete this antibiotic? This action cannot be undone.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-4 mt-4">
                        {activeView === "delete" && selectedAntibiotic && (
                            <DeleteAntibioticPanel
                                antibiotic={selectedAntibiotic}
                                onConfirm={() => deleteMutation.mutate(selectedAntibiotic.id, { onSuccess: closeView })}
                                onCancel={closeView}
                                isPending={deleteMutation.isPending}
                                error={deleteMutation.error}
                            />
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}