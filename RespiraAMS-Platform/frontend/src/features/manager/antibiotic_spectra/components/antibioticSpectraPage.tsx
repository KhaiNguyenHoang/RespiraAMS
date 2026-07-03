"use client"

import { useState } from "react";
import { useCreateAntibioticSpectrum, useUpdateAntibioticSpectrum, useDeleteAntibioticSpectrum } from "../queries";
import { AntibioticSpectrumItem } from "../models";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { AntibioticSpectraTable } from "./antibioticSpectraTable";
import CreateAntibioticSpectrumForm from "./createAntibioticSpectrumForm";
import UpdateAntibioticSpectrumForm from "./updateAntibioticSpectrumForm";
import { TableTitle } from "../../shared/components/tableTitle";
import { DeletePanel } from "../../shared/components/deletePanel";

type ActiveView = "create" | "update" | "delete" | null;

export function AntibioticSpectraPage() {
    const [activeView, setActiveView] = useState<ActiveView>(null);
    const [selectedSpectrum, setSelectedSpectrum] = useState<AntibioticSpectrumItem | null>(null);

    const createMutation = useCreateAntibioticSpectrum();
    const updateMutation = useUpdateAntibioticSpectrum();
    const deleteMutation = useDeleteAntibioticSpectrum();

    const openView = (view: ActiveView, spectrum?: AntibioticSpectrumItem) => {
        setSelectedSpectrum(spectrum ?? null);
        setActiveView(view);
    };

    const closeView = () => {
        setActiveView(null);
        setSelectedSpectrum(null);
    };

    const isDialogOpen = activeView === "create" || activeView === "update";
    const isSheetOpen = activeView === "delete";

    return (
        <>
            <TableTitle
                title="Phổ kháng sinh"
                onClick={() => openView("create")}
            />

            <AntibioticSpectraTable
                onEdit={(spectrum) => openView("update", spectrum)}
                onDelete={(spectrum) => openView("delete", spectrum)}
            />

            <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {activeView === "create" && "Create Antibiotic Spectrum"}
                            {activeView === "update" && "Update Antibiotic Spectrum"}
                        </DialogTitle>
                        <DialogDescription>
                            {activeView === "create" && "Fill in the details to create a new antibiotic spectrum."}
                            {activeView === "update" && "Modify the antibiotic spectrum details."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        {activeView === "create" && (
                            <CreateAntibioticSpectrumForm
                                onSubmit={(data) => createMutation.mutate(data, { onSuccess: closeView })}
                                onCancel={closeView}
                                isPending={createMutation.isPending}
                                error={createMutation.error}
                            />
                        )}

                        {activeView === "update" && selectedSpectrum && (
                            <UpdateAntibioticSpectrumForm
                                initialValues={selectedSpectrum}
                                onSubmit={(data) => updateMutation.mutate(data, { onSuccess: closeView })}
                                onCancel={closeView}
                                isPending={updateMutation.isPending}
                                error={updateMutation.error}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeView(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete Antibiotic Spectrum</SheetTitle>
                        <SheetDescription>
                            Confirm deletion of the antibiotic spectrum
                            <strong className="text-red-600"> {selectedSpectrum?.name}</strong>.
                            This action cannot be undone.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="pb-4">
                        {activeView === "delete" && selectedSpectrum && (
                            <DeletePanel
                                onConfirm={() => deleteMutation.mutate(selectedSpectrum.id, { onSuccess: closeView })}
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