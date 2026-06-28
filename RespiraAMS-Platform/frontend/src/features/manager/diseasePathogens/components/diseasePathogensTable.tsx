"use client"

import { useState } from "react";
import { DiseasePathogen } from "../models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import DiseasePathogenForm from "./diseasePathogenForm";
import DeleteDiseasePathogenPanel from "./deleteDiseasePathogenPanel";
import { useCreateDiseasePathogen, useUpdateDiseasePathogen, useDeleteDiseasePathogen } from "../queries";

interface Props {
    diseaseId: string;
    pathogens: DiseasePathogen[];
}

type DialogView = "create" | "update" | "delete" | null;

export function DiseasePathogensTable({ diseaseId, pathogens }: Props) {
    const [dialogView, setDialogView] = useState<DialogView>(null);
    const [selectedItem, setSelectedItem] = useState<DiseasePathogen | null>(null);

    const createMutation = useCreateDiseasePathogen(diseaseId);
    const updateMutation = useUpdateDiseasePathogen(diseaseId);
    const deleteMutation = useDeleteDiseasePathogen(diseaseId);

    const openDialog = (view: DialogView, item?: DiseasePathogen) => {
        setSelectedItem(item ?? null);
        setDialogView(view);
    };

    const closeDialog = () => {
        setDialogView(null);
        setSelectedItem(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Causes</h2>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => openDialog("create")}>
                    <Plus className="w-4 h-4" /> Add Cause
                </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Pathogen</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Treatment Site</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pathogens?.length > 0 ? pathogens.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-primary">{item.pathogen}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 rounded bg-zinc-100 text-zinc-700 text-xs font-semibold">
                                        {item.severity}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                                        {item.treatmentSite}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => openDialog("update", item)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => openDialog("delete", item)}><Trash className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">No causes found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogView !== null} onOpenChange={(val) => !val && closeDialog()}>
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
                                    createMutation.mutate(data, { onSuccess: closeDialog });
                                } else if (dialogView === "update" && selectedItem) {
                                    updateMutation.mutate({ id: selectedItem.id, ...data }, { onSuccess: closeDialog });
                                }
                            }}
                            onCancel={closeDialog}
                            isPending={createMutation.isPending || updateMutation.isPending}
                            error={createMutation.error || updateMutation.error}
                        />
                    )}

                    {dialogView === "delete" && selectedItem && (
                        <DeleteDiseasePathogenPanel
                            item={selectedItem}
                            onConfirm={() => deleteMutation.mutate(selectedItem.id, { onSuccess: closeDialog })}
                            onCancel={closeDialog}
                            isPending={deleteMutation.isPending}
                            error={deleteMutation.error}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}