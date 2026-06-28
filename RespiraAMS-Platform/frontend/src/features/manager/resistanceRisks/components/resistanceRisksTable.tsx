"use client"

import { useState } from "react";
import { ResistanceRisk } from "../../resistanceRisks/models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { CriterionDisplay } from "../../diseases/components/criterionDisplay";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Import form và panel
import ResistanceRiskForm from "./resistanceRiskForm";
import DeleteResistanceRiskPanel from "./deleteResistanceRiskPanel";
import { useCreateResistanceRisk, useUpdateResistanceRisk, useDeleteResistanceRisk } from "../../resistanceRisks/queries";

interface Props {
    diseaseId: string;
    risks: ResistanceRisk[];
}

type DialogView = "create" | "update" | "delete" | null;

export function ResistanceRisksTable({ diseaseId, risks }: Props) {
    const [dialogView, setDialogView] = useState<DialogView>(null);
    const [selectedItem, setSelectedItem] = useState<ResistanceRisk | null>(null);

    const createMutation = useCreateResistanceRisk(diseaseId);
    const updateMutation = useUpdateResistanceRisk(diseaseId);
    const deleteMutation = useDeleteResistanceRisk(diseaseId);

    const openDialog = (view: DialogView, item?: ResistanceRisk) => {
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
                <h2 className="text-lg font-bold">Resistance Risks</h2>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => openDialog("create")}>
                    <Plus className="w-4 h-4" /> Add Resistance Risk
                </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Pathogen</TableHead>
                            <TableHead className="w-[25%]">Risk Name</TableHead>
                            <TableHead className="w-[25%]">Criterion Detail</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {risks?.length > 0 ? risks.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-primary align-top">{item.pathogen}</TableCell>
                                <TableCell className="text-sm align-top">
                                    <div className="whitespace-normal break-words max-w-[200px] leading-relaxed">
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm align-top">
                                    <div className="whitespace-normal break-words max-w-[200px] leading-relaxed text-zinc-600">
                                        {item.criterion.name}
                                    </div>
                                </TableCell>
                                <TableCell className="align-top"><CriterionDisplay criterion={item.criterion} /></TableCell>
                                <TableCell className="text-right align-top">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => openDialog("update", item)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => openDialog("delete", item)}><Trash className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-6">No records found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogView !== null} onOpenChange={(val) => !val && closeDialog()}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg [&>button]:hidden">
                    <DialogTitle className="sr-only">
                        Resistance Risks
                    </DialogTitle>
                    {(dialogView === "create" || (dialogView === "update" && selectedItem)) && (
                        <ResistanceRiskForm
                            initialData={dialogView === "update" ? selectedItem : null}
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
                        <DeleteResistanceRiskPanel
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