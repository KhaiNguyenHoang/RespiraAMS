"use client"

import { useState } from "react";
import { useCreatePathogen, useUpdatePathogen, useDeletePathogen } from "../queries";
import { PathogenItem } from "../models";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PathogensTable } from "./pathogensTable";
import PathogenForm from "./pathogenForm";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { TableTitle } from "../../shared/components/tableTitle";
import { DeletePanel } from "../../shared/components/deletePanel";

type ActiveView = "create" | "update" | "delete" | null;

export function PathogensPage() {
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const [selectedPathogen, setSelectedPathogen] = useState<PathogenItem | null>(null);

    const createMutation = useCreatePathogen();
    const updateMutation = useUpdatePathogen();
    const deleteMutation = useDeletePathogen();

    const openView = (view: ActiveView, item?: PathogenItem) => {
        setSelectedPathogen(item ?? null);
        setActiveView(view);
    };

    const closeView = () => {
        setActiveView(null);
        setSelectedPathogen(null);
    };

    const isDialogOpen = activeView === "create" || activeView === "update";
    const isSheetOpen = activeView === "delete";

    return (
        <div className="container mx-auto">
            <TableTitle title="Tác nhân gây bệnh" onClick={() => openView("create")} />

            <PathogensTable
                onEdit={(item) => openView("update", item)}
                onDelete={(item) => openView("delete", item)}
            />

            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {activeView === "create" && "Create New Pathogen"}
                            {activeView === "update" && "Update Pathogen"}
                        </DialogTitle>
                        <DialogDescription>
                            {activeView === "create" && "Fill in the information below to create a new entry."}
                            {activeView === "update" && "Modify the pathogen name or description."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        {(activeView === "create" || (activeView === "update" && selectedPathogen)) && (
                            <PathogenForm
                                initialData={activeView === "update" ? selectedPathogen : null}
                                onSubmit={(data) => {
                                    if (activeView === "create") {
                                        createMutation.mutate(data, { onSuccess: closeView });
                                    } else if (activeView === "update" && selectedPathogen) {
                                        updateMutation.mutate({ id: selectedPathogen.id, ...data }, { onSuccess: closeView });
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
                        <SheetTitle>Delete Pathogen</SheetTitle>
                        <SheetDescription>Confirm pathogen deletion. This action cannot be undone.</SheetDescription>
                    </SheetHeader>

                    <div className="py-4 mt-4">
                        {activeView === "delete" && selectedPathogen && (
                            <DeletePanel
                                onConfirm={() => deleteMutation.mutate(selectedPathogen.id, { onSuccess: closeView })}
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