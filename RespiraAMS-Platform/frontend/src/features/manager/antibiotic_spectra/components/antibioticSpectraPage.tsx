"use client"

import { useState } from "react";
import { useCreateAntibioticSpectrum, useUpdateAntibioticSpectrum, useDeleteAntibioticSpectrum } from "../queries";
import { AntibioticSpectrumItem } from "../models";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { AntibioticSpectraTable } from "./antibioticSpectraTable";
import CreateAntibioticSpectrumForm from "./createAntibioticSpectrumForm";
import UpdateAntibioticSpectrumForm from "./updateAntibioticSpectrumForm";
import DeleteAntibioticSpectrumPanel from "./deleteAntibioticSpectrumPanel";

type SheetView = "create" | "update" | "delete" | null;

export function AntibioticSpectraPage() {
    const [sheetView, setSheetView] = useState<SheetView>(null);
    const [selectedSpectrum, setSelectedSpectrum] = useState<AntibioticSpectrumItem | null>(null);

    const createMutation = useCreateAntibioticSpectrum();
    const updateMutation = useUpdateAntibioticSpectrum();
    const deleteMutation = useDeleteAntibioticSpectrum();

    const openSheet = (view: SheetView, spectrum?: AntibioticSpectrumItem) => {
        setSelectedSpectrum(spectrum ?? null);
        setSheetView(view);
    };

    const closeSheet = () => {
        setSheetView(null);
        setSelectedSpectrum(null);
    };

    const isSheetOpen = sheetView !== null;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Antibiotic Spectra</h1>
                <Button onClick={() => openSheet("create")}>
                    <Plus /> Create
                </Button>
            </div>

            <AntibioticSpectraTable
                onEdit={(spectrum) => openSheet("update", spectrum)}
                onDelete={(spectrum) => openSheet("delete", spectrum)}
            />

            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>
                            {sheetView === "create" && "Create Antibiotic Spectrum"}
                            {sheetView === "update" && "Update Antibiotic Spectrum"}
                            {sheetView === "delete" && "Delete Antibiotic Spectrum"}
                        </SheetTitle>
                        <SheetDescription>
                            {sheetView === "create" && "Fill in the details to create a new antibiotic spectrum."}
                            {sheetView === "update" && "Modify the antibiotic spectrum details."}
                            {sheetView === "delete" && "Confirm deletion of the antibiotic spectrum."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-4">
                        {sheetView === "create" && (
                            <CreateAntibioticSpectrumForm
                                onSubmit={(data) => createMutation.mutate(data, { onSuccess: closeSheet })}
                                onCancel={closeSheet}
                                isPending={createMutation.isPending}
                                error={createMutation.error}
                            />
                        )}

                        {sheetView === "update" && selectedSpectrum && (
                            <UpdateAntibioticSpectrumForm
                                initialValues={selectedSpectrum}
                                onSubmit={(data) => updateMutation.mutate(data, { onSuccess: closeSheet })}
                                onCancel={closeSheet}
                                isPending={updateMutation.isPending}
                                error={updateMutation.error}
                            />
                        )}

                        {sheetView === "delete" && selectedSpectrum && (
                            <DeleteAntibioticSpectrumPanel
                                spectrum={selectedSpectrum}
                                onConfirm={() => deleteMutation.mutate(selectedSpectrum.id, { onSuccess: closeSheet })}
                                onCancel={closeSheet}
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
