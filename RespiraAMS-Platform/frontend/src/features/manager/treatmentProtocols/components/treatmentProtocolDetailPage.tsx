"use client"

import { useTreatmentProtocolDetail, useUpdateTreatmentProtocol, useDeleteTreatmentProtocol, useAddProtocolCriteria } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import TreatmentProtocolForm from "./treatmentProtocolForm";
import { useState } from "react";
import { Severity, TreatmentSite } from "../../shared/models";
import { SeverityBadge } from "../../shared/components/severityBadge";
import { TreatmentSiteBadge } from "../../shared/components/treatmentSiteBadge";
import ProtocolCriterionForm from "./protocolCriterionForm";
import { CriterionBadge } from "../../shared/components/criterionBadge";
import { DeletePanel } from "../../shared/components/deletePanel";

interface ProtocolDetailViewProps {
    diseaseId: string;
    id: string;
    onBack: () => void;
}

type ModalView = "update" | "delete" | "addCriterion" | null;

export default function TreatmentProtocolDetailView({ diseaseId, id, onBack }: ProtocolDetailViewProps) {
    const { data: protocol, isLoading, isError } = useTreatmentProtocolDetail(id);

    const [modalView, setModalView] = useState<ModalView>(null);
    const [sheetView, setSheetView] = useState<"delete" | "deleteCriterion" | null>(null);
    const [criterionToDelete, setCriterionToDelete] = useState<{ id: string, name: string } | null>(null);

    const updateMutation = useUpdateTreatmentProtocol(diseaseId);
    const deleteMutation = useDeleteTreatmentProtocol(diseaseId);
    const addCriterionMutation = useAddProtocolCriteria(id);
    const closeAll = () => { setModalView(null); setSheetView(null); setCriterionToDelete(null); };

    const confirmDeleteCriterion = () => {
        if (!protocol || !criterionToDelete) return;

        const updatedCriteriaIds = protocol.otherCriteria
            .filter(c => c.id !== criterionToDelete.id)
            .map(c => c.id);

        const mapSeverity = Object.values(Severity).find(s => s.toLowerCase() === protocol.severity?.toLowerCase()) || "";
        const mapSite = Object.values(TreatmentSite).find(t => t.toLowerCase() === protocol.treatmentSite?.toLowerCase()) || "";

        updateMutation.mutate({
            id: protocol.id,
            name: protocol.name,
            issuer: protocol.issuer,
            issueDate: protocol.issueDate ? new Date(protocol.issueDate).toISOString().split('T')[0] : "",
            version: protocol.version,
            severity: mapSeverity,
            treatmentSite: mapSite,
            specialInfectionId: protocol.specialInfection?.id || null,
            medicineIds: protocol.medicines?.map(m => m.id) || [],
            otherCriteriaIds: updatedCriteriaIds
        }, {
            onSuccess: closeAll
        });
    };

    if (isLoading) return <Skeleton className="w-full h-[80vh] rounded-xl" />;
    if (isError || !protocol) return <ErrorMessage error="Failed to load protocol details" />;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Disease
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">{protocol.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setModalView("update")} className="gap-2">
                            <Edit className="w-4 h-4" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => setSheetView("delete")} className="gap-2">
                            <Trash className="w-4 h-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Version</p>
                        <p className="text-base font-bold text-zinc-900">{protocol.version}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Issuer</p>
                        <p className="text-base font-bold text-zinc-900">{protocol.issuer}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Issue Date</p>
                        <p className="text-base font-bold text-zinc-900">{new Date(protocol.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Special Infection</p>
                        <p className="text-base font-bold text-red-600">
                            {protocol.specialInfection?.name || "None"}
                        </p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Severity</p>
                        <div className="mt-1"><SeverityBadge severity={protocol.severity} /></div>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Treatment Site</p>
                        <div className="mt-1"><TreatmentSiteBadge treatmentSite={protocol.treatmentSite} /></div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Medicines (Antibiotics)</h2>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Medicine Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Spectrum</TableHead>
                            <TableHead>Dosages</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {protocol.medicines?.length > 0 ? protocol.medicines.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium align-middle">
                                    <span className="text-primary w-fit shrink-0">{item.name}</span>
                                </TableCell>
                                <TableCell className="align-middle">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 uppercase border border-blue-200">
                                        {item.category}
                                    </span>
                                </TableCell>
                                <TableCell className="text-foreground align-middle wrap-break-word whitespace-normal">
                                    <div className="font-semibold">{item.antibioticSpectrum?.name || "N/A"}</div>
                                    {/* {item.antibioticSpectrum?.description && (
                                        <div className="text-xs mt-0.5 text-muted-foreground wrap-break-word whitespace-normal">{item.antibioticSpectrum.description}</div>
                                    )} */}
                                </TableCell>
                                <TableCell className="align-middle">
                                    {item.dosages && Object.keys(item.dosages).length > 0 ? (
                                        <div className="flex flex-col gap-2">
                                            {Object.entries(item.dosages).map(([route, doses]) => (
                                                <div key={route} className="text-sm bg-zinc-50 p-2 rounded border border-zinc-100">
                                                    <span className="font-bold capitalize text-zinc-800 block mb-1">
                                                        {route}:
                                                    </span>
                                                    <ul className="list-disc pl-4 text-zinc-600 space-y-1">
                                                        {doses.map((dose, idx) => <li key={idx}>{dose}</li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic text-sm">N/A</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">No medicines prescribed.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Other Criteria</h2>
                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setModalView("addCriterion")}>
                        <Plus className="w-4 h-4" /> Add Criterion
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Criterion Name</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {protocol.otherCriteria?.length > 0 ? protocol.otherCriteria.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium align-middle">
                                    <span className="text-primary w-fit shrink-0">{item.name}</span>
                                </TableCell>
                                <TableCell className="align-middle"><CriterionBadge criterion={item as any} /></TableCell>
                                <TableCell className="flex gap-2">
                                    <Button variant="ghost" onClick={() => {
                                        setCriterionToDelete({ id: item.id, name: item.name });
                                        setSheetView("deleteCriterion");
                                    }}>
                                        <Trash className="text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={3} className="text-center text-zinc-500 py-6">No extra criteria attached.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={modalView === "update" || modalView === "addCriterion"} onOpenChange={(open) => { if (!open) closeAll(); }}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg sm:max-w-3xl [&>button]:hidden">
                    <DialogTitle className="sr-only">Treatment Protocol</DialogTitle>

                    {modalView === "update" && (
                        <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col">
                            <TreatmentProtocolForm
                                initialData={protocol}
                                onSubmit={(data) => {
                                    updateMutation.mutate({ id: protocol.id, ...data }, { onSuccess: closeAll });
                                }}
                                onCancel={closeAll}
                                isPending={updateMutation.isPending}
                                error={updateMutation.error}
                            />
                        </div>
                    )}

                    {modalView === "addCriterion" && (
                        <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col max-w-lg mx-auto w-full">
                            <ProtocolCriterionForm
                                onSubmit={(data) => addCriterionMutation.mutate(data, { onSuccess: closeAll })}
                                onCancel={closeAll}
                                isPending={addCriterionMutation.isPending}
                                error={addCriterionMutation.error}
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <Sheet open={sheetView === "delete"} onOpenChange={(open) => { if (!open) closeAll(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete Treatment Protocol</SheetTitle>
                        <SheetDescription>Confirm deletion of this protocol. This action cannot be undone.</SheetDescription>
                    </SheetHeader>
                    <div className="py-4 mt-4">
                        <DeletePanel
                            onConfirm={() => deleteMutation.mutate(protocol.id, {
                                onSuccess: () => { closeAll(); onBack(); }
                            })}
                            onCancel={closeAll}
                            isPending={deleteMutation.isPending}
                            error={deleteMutation.error}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            <Sheet open={sheetView === "deleteCriterion"} onOpenChange={(open) => { if (!open) closeAll(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Remove Criterion</SheetTitle>
                        <SheetDescription>
                            Are you sure you want to remove <strong>{criterionToDelete?.name}</strong> from this protocol? This action cannot be undone.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 mt-4">
                        {updateMutation.error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                                <p className="text-sm text-red-600 font-bold">{updateMutation.error.message}</p>
                            </div>
                        )}
                        <DeletePanel
                            onConfirm={confirmDeleteCriterion}
                            onCancel={closeAll}
                            isPending={updateMutation.isPending}
                            error={null}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
