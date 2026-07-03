"use client"

import { useState } from "react";
import { useCreateAntibioticSpectrum, useUpdateAntibioticSpectrum, useDeleteAntibioticSpectrum } from "../queries";
import { AntibioticSpectrumItem } from "../models";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { Plus } from "lucide-react";
import { AntibioticSpectraTable } from "./antibioticSpectraTable";
import CreateAntibioticSpectrumForm from "./createAntibioticSpectrumForm";
import UpdateAntibioticSpectrumForm from "./updateAntibioticSpectrumForm";
import DeleteAntibioticSpectrumPanel from "./deleteAntibioticSpectrumPanel";

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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Antibiotic Spectra</h1>
                <Button onClick={() => openView("create")} className="gap-2">
                    <Plus className="h-4 w-4" /> Create
                </Button>
            </div>

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
                            Confirm deletion of the antibiotic spectrum. This action cannot be undone.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="py-4 mt-4">
                        {activeView === "delete" && selectedSpectrum && (
                            <DeleteAntibioticSpectrumPanel
                                spectrum={selectedSpectrum}
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