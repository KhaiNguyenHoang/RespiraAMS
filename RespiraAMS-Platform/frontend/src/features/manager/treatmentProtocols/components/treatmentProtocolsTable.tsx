"use client"

import { useState } from "react";
import { TreatmentProtocol } from "../../treatmentProtocols/models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import TreatmentProtocolForm from "./treatmentProtocolForm";
import DeleteTreatmentProtocolPanel from "./deleteTreatmentProtocolPanel";
import { useCreateTreatmentProtocol, useDeleteTreatmentProtocol } from "../../treatmentProtocols/queries";

interface Props {
    diseaseId: string;
    protocols: TreatmentProtocol[];
    onView: (id: string) => void;
}

type DialogView = "create" | "delete" | null;

export function TreatmentProtocolsTable({ diseaseId, protocols, onView }: Props) {
    const [dialogView, setDialogView] = useState<DialogView>(null);
    const [selectedItem, setSelectedItem] = useState<TreatmentProtocol | null>(null);

    const createMutation = useCreateTreatmentProtocol(diseaseId);
    const deleteMutation = useDeleteTreatmentProtocol(diseaseId);

    const openDialog = (view: DialogView, item?: TreatmentProtocol) => {
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
                <h2 className="text-lg font-bold">Treatment Protocols</h2>
                <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => openDialog("create")}>
                    <Plus className="w-4 h-4" /> Add Protocol
                </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Issuer</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {protocols?.length > 0 ? protocols.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-semibold text-primary">{item.name}</TableCell>
                                <TableCell>{item.issuer}</TableCell>
                                <TableCell>v{item.version}</TableCell>
                                <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => onView(item.id)} title="View Detail">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        {/* <Button variant="outline" size="icon" onClick={() => console.log("Stub: Edit", item.id)}><Edit className="w-4 h-4" /></Button> */}
                                        
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
                <DialogContent  className="p-0 border-none bg-transparent shadow-none max-w-lg sm:max-w-3xl [&>button]:hidden">
                    <DialogTitle className="sr-only">
                        Treatment Protocol
                    </DialogTitle>
                    {dialogView === "create" && (
                        <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col">
                            <TreatmentProtocolForm
                                onSubmit={(data) => createMutation.mutate(data, { onSuccess: closeDialog })}
                                onCancel={closeDialog}
                                isPending={createMutation.isPending}
                                error={createMutation.error}
                            />
                        </div>
                    )}

                    {dialogView === "delete" && selectedItem && (
                        <DeleteTreatmentProtocolPanel
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