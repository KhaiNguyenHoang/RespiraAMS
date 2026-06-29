"use client"

import { useState } from "react";
import { IcuHospitalizeCriterion } from "../models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { CriterionDisplay } from "../../diseases/components/criterionDisplay";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IcuHospitalizeCriteriaForm from "./icuHospitalizeCriteriaForm";
import DeleteIcuCriterionPanel from "./deleteIcuCriterionPanel";

import { useCreateIcuCriterion, useUpdateIcuCriterion, useDeleteIcuCriterion } from "../queries";

interface Props {
    diseaseId: string;
    criteria: IcuHospitalizeCriterion[];
}

type DialogView = "create" | "update" | "delete" | null;

export function IcuHospitalizeCriteriaTable({ diseaseId, criteria }: Props) {
    const [dialogView, setDialogView] = useState<DialogView>(null);
    const [selectedItem, setSelectedItem] = useState<IcuHospitalizeCriterion | null>(null);

    const createMutation = useCreateIcuCriterion(diseaseId);
    const updateMutation = useUpdateIcuCriterion(diseaseId);
    const deleteMutation = useDeleteIcuCriterion(diseaseId);

    const openDialog = (view: DialogView, item?: IcuHospitalizeCriterion) => {
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
                <h2 className="text-lg font-bold">ICU Hospitalization Criteria</h2>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => openDialog("create")}>
                    <Plus className="w-4 h-4" /> Add ICU Criterion
                </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Criterion Name</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {criteria?.length > 0 ? criteria.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.criterion.name}</TableCell>
                                <TableCell><CriterionDisplay criterion={item.criterion} /></TableCell>
                                <TableCell>
                                    {item.isMainCriteria ? (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Main</span>
                                    ) : (
                                        <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-semibold">Secondary</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => openDialog("update", item)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => openDialog("delete", item)}><Trash className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">No records found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={dialogView !== null} onOpenChange={(val) => !val && closeDialog()}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg [&>button]:hidden">
                    <DialogTitle className="sr-only">
                        ICU Hospitalize Criteria
                    </DialogTitle>
                    {(dialogView === "create" || (dialogView === "update" && selectedItem)) && (
                        <IcuHospitalizeCriteriaForm
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
                        <DeleteIcuCriterionPanel
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