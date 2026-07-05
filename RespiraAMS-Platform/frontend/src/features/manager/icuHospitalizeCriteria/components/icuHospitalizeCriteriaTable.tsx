"use client"

import { useState } from "react";
import { IcuHospitalizeCriterion } from "../models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import IcuHospitalizeCriteriaForm from "./icuHospitalizeCriteriaForm";

import { useCreateIcuCriterion, useUpdateIcuCriterion, useDeleteIcuCriterion } from "../queries";
import { Badge } from "@/components/ui/badge";
import { CriterionBadge } from "../../shared/components/criterionBadge";
import { DeletePanel } from "../../shared/components/deletePanel";

interface Props {
    diseaseId: string;
    criteria: IcuHospitalizeCriterion[];
}

type DialogView = "create" | "update" | null;

export function IcuHospitalizeCriteriaTable({ diseaseId, criteria }: Props) {
    const [dialogView, setDialogView] = useState<DialogView>(null);
    const [sheetView, setSheetView] = useState(false);
    const [selectedItem, setSelectedItem] = useState<IcuHospitalizeCriterion | null>(null);

    const createMutation = useCreateIcuCriterion(diseaseId);
    const updateMutation = useUpdateIcuCriterion(diseaseId);
    const deleteMutation = useDeleteIcuCriterion(diseaseId);

    const openDialog = (view: DialogView, item?: IcuHospitalizeCriterion) => {
        setSelectedItem(item ?? null);
        setDialogView(view);
    };

    const openDeleteSheet = (item: IcuHospitalizeCriterion) => {
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
                    <Plus className="w-4 h-4" /> Add ICU Criterion
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Criterion Name</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {criteria?.length > 0 ? criteria.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium align-middle">
                                <span className="text-primary w-fit shrink-0">
                                    {item.criterion.name}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <CriterionBadge criterion={item.criterion} />
                            </TableCell>
                            <TableCell className="align-middle">
                                {item.isMainCriteria ? (
                                    <Badge variant="default">Main</Badge>
                                ) : (
                                    <Badge variant="outline">Secondary</Badge>
                                )}
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" onClick={() => openDialog("update", item)}><Edit /></Button>
                                <Button variant="ghost" onClick={() => openDeleteSheet(item)}><Trash className="text-destructive" /></Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">No records found.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog open={dialogView === "create" || dialogView === "update"} onOpenChange={(val) => { if (!val) closeAll(); }}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg [&>button]:hidden">
                    <DialogTitle className="sr-only">
                        ICU Hospitalize Criteria
                    </DialogTitle>
                    {(dialogView === "create" || (dialogView === "update" && selectedItem)) && (
                        <IcuHospitalizeCriteriaForm
                            initialData={dialogView === "update" ? selectedItem : null}
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
                        <SheetTitle>Delete ICU Criterion</SheetTitle>
                        <SheetDescription>Confirm deletion of this criterion. This action cannot be undone.</SheetDescription>
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
