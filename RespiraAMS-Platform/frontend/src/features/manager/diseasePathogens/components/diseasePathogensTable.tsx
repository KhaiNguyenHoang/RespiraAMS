"use client"

import { useState } from "react";
import { DiseasePathogen } from "../models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import DiseasePathogenForm from "./diseasePathogenForm";
import { useCreateDiseasePathogen, useUpdateDiseasePathogen, useDeleteDiseasePathogen } from "../queries";
import { DeletePanel } from "../../shared/components/deletePanel";
import { SeverityBadge } from "../../shared/components/severityBadge";
import { TreatmentSiteBadge } from "../../shared/components/treatmentSiteBadge";

interface Props {
    diseaseId: string;
    pathogens: DiseasePathogen[];
}

type DialogView = "create" | "update" | null;

export function DiseasePathogensTable({ diseaseId, pathogens }: Props) {
    const [dialogView, setDialogView] = useState<DialogView>(null);
    const [sheetView, setSheetView] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DiseasePathogen | null>(null);

    const createMutation = useCreateDiseasePathogen(diseaseId);
    const updateMutation = useUpdateDiseasePathogen(diseaseId);
    const deleteMutation = useDeleteDiseasePathogen(diseaseId);

    const openDialog = (view: DialogView, item?: DiseasePathogen) => {
        setSelectedItem(item ?? null);
        setDialogView(view);
    };

    const openDeleteSheet = (item: DiseasePathogen) => {
        setSelectedItem(item);
        setSheetView(true);
    };

    const closeAll = () => {
        setDialogView(null);
        setSheetView(false);
        setSelectedItem(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => openDialog("create")}>
                    <Plus className="w-4 h-4" /> Add Cause
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pathogen</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Treatment Site</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pathogens?.length > 0 ? pathogens.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium align-middle">
                                <span className="text-primary w-fit shrink-0">
                                    {item.pathogen}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <SeverityBadge severity={item.severity} />
                            </TableCell>
                            <TableCell className="align-middle">
                                <TreatmentSiteBadge treatmentSite={item.treatmentSite} />
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" onClick={() => openDialog("update", item)}><Edit /></Button>
                                <Button variant="ghost" onClick={() => openDeleteSheet(item)}><Trash className="text-destructive" /></Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">No causes found.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog open={dialogView === "create" || dialogView === "update"} onOpenChange={(val) => { if (!val) closeAll(); }}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg [&>button]:hidden">
                    <DialogTitle className="sr-only">
                        Cause
                    </DialogTitle>
                    {(dialogView === "create" || (dialogView === "update" && selectedItem)) && (
                        <DiseasePathogenForm
                            initialData={dialogView === "update" ? selectedItem : null}
                            existingPathogens={pathogens}
                            onSubmit={(data) => {
                                if (dialogView === "create") {
                                    createMutation.mutate(data, { onSuccess: closeAll });
                                } else if (dialogView === "update" && selectedItem) {
                                    updateMutation.mutate({ id: selectedItem.id, ...data }, { onSuccess: closeAll });
                                }
                            }}
                            onCancel={closeAll}
                            isPending={createMutation.isPending || updateMutation.isPending}
                            error={createMutation.error || updateMutation.error}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Sheet open={sheetView} onOpenChange={(val) => { if (!val) closeAll(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete Cause</SheetTitle>
                        <SheetDescription>Confirm removal of this cause. This action cannot be undone.</SheetDescription>
                    </SheetHeader>
                    <div className="py-4 mt-4">
                        {selectedItem && (
                            <DeletePanel
                                onConfirm={() => deleteMutation.mutate(selectedItem.id, { onSuccess: closeAll })}
                                onCancel={closeAll}
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
