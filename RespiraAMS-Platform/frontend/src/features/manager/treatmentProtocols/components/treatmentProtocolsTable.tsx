"use client"

import { useState } from "react";
import { TreatmentProtocol } from "../../treatmentProtocols/models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash, Plus, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

import TreatmentProtocolForm from "./treatmentProtocolForm";
import { useCreateTreatmentProtocol, useDeleteTreatmentProtocol } from "../../treatmentProtocols/queries";
import { DeletePanel } from "../../shared/components/deletePanel";

interface Props {
    diseaseId: string;
    protocols: TreatmentProtocol[];
    onView: (id: string) => void;
}

export function TreatmentProtocolsTable({ diseaseId, protocols, onView }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TreatmentProtocol | null>(null);

    const createMutation = useCreateTreatmentProtocol(diseaseId);
    const deleteMutation = useDeleteTreatmentProtocol(diseaseId);

    const openCreateDialog = () => {
        setSelectedItem(null);
        setDialogOpen(true);
    };

    const openDeleteSheet = (item: TreatmentProtocol) => {
        setSelectedItem(item);
        setSheetOpen(true);
    };

    const closeAll = () => {
        setDialogOpen(false);
        setSheetOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={openCreateDialog}>
                    <Plus className="w-4 h-4" /> Add Protocol
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Issuer</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {protocols?.length > 0 ? protocols.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium align-middle">
                                <span className="text-primary w-fit shrink-0">
                                    {item.name}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground w-fit shrink-0">
                                    {item.issuer}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground w-fit shrink-0">
                                    v{item.version}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground w-fit shrink-0">
                                    {new Date(item.issueDate).toLocaleDateString()}
                                </span>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" onClick={() => onView(item.id)}>
                                    <Eye />
                                </Button>
                                <Button variant="ghost" onClick={() => openDeleteSheet(item)}>
                                    <Trash className="text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : (
                        <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-6">No records found.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>

            <Dialog open={dialogOpen} onOpenChange={(val) => { if (!val) closeAll(); }}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg sm:max-w-3xl [&>button]:hidden">
                    <DialogTitle className="sr-only">
                        Treatment Protocol
                    </DialogTitle>
                    <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col">
                        <TreatmentProtocolForm
                            onSubmit={(data) => createMutation.mutate(data, { onSuccess: closeAll })}
                            onCancel={closeAll}
                            isPending={createMutation.isPending}
                            error={createMutation.error}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <Sheet open={sheetOpen} onOpenChange={(val) => { if (!val) closeAll(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete Treatment Protocol</SheetTitle>
                        <SheetDescription>Confirm deletion of this protocol. This action cannot be undone.</SheetDescription>
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
