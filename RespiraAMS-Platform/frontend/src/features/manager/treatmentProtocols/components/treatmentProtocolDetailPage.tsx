"use client"

import { useTreatmentProtocolDetail, useUpdateTreatmentProtocol, useDeleteTreatmentProtocol, useAddProtocolCriteria } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react";
import { CriterionDisplay } from "../../diseases/components/criterionDisplay";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import TreatmentProtocolForm from "./treatmentProtocolForm";
import DeleteTreatmentProtocolPanel from "./deleteTreatmentProtocolPanel";
import { useState } from "react";
import { Severity, TreatmentSite } from "../../diseasePathogens/models";
import ProtocolCriterionForm from "./protocolCriterionForm";

interface ProtocolDetailViewProps {
    diseaseId: string;
    id: string;
    onBack: () => void;
}

type ModalView = "update" | "delete" | "addCriterion" | "deleteCriterion" | null;

export default function TreatmentProtocolDetailView({diseaseId, id, onBack }: ProtocolDetailViewProps) {
    const { data: protocol, isLoading, isError } = useTreatmentProtocolDetail(id);

    const [modalView, setModalView] = useState<ModalView>(null);
    const [criterionToDelete, setCriterionToDelete] = useState<{ id: string, name: string } | null>(null);

    const updateMutation = useUpdateTreatmentProtocol(diseaseId);
    const deleteMutation = useDeleteTreatmentProtocol(diseaseId);
    const addCriterionMutation = useAddProtocolCriteria(id);
    const closeModal = () => setModalView(null);

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
            onSuccess: () => {
                closeModal();
            }
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
                        <Button variant="destructive" onClick={() => setModalView("delete")} className="gap-2">
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
                        <span className="inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-zinc-200 text-zinc-800 uppercase">
                            {protocol.severity}
                        </span>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Treatment Site</p>
                        <span className="inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                            {protocol.treatmentSite}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Medicines (Antibiotics)</h2>
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="w-[20%]">Medicine Name</TableHead>
                                <TableHead className="w-[15%]">Category</TableHead>
                                <TableHead className="w-[25%]">Spectrum</TableHead>
                                <TableHead>Dosages</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {protocol.medicines?.length > 0 ? protocol.medicines.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold align-top text-primary">{item.name}</TableCell>
                                    <TableCell className="align-top">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 uppercase border border-blue-200">
                                            {item.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="align-top text-sm text-zinc-600">
                                        <div className="font-semibold text-zinc-800">{item.antibioticSpectrum?.name || "N/A"}</div>
                                        <div className="text-xs mt-1 text-zinc-500 leading-relaxed break-words whitespace-normal" title={item.antibioticSpectrum?.description}>
                                            {item.antibioticSpectrum?.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top">
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
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Other Criteria</h2>
                    <Button size="sm" className="gap-2 bg-primary hover:bg-primary/90" onClick={() => setModalView("addCriterion")}>
                        <Plus className="w-4 h-4" /> Add Criterion
                    </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="w-[50%]">Criterion Name</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {protocol.otherCriteria?.length > 0 ? protocol.otherCriteria.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell><CriterionDisplay criterion={item as any} /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                disabled={updateMutation.isPending} 
                                                onClick={() => {
                                                    setCriterionToDelete({ id: item.id, name: item.name });
                                                    setModalView("deleteCriterion");
                                                }}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={3} className="text-center text-zinc-500 py-6">No extra criteria attached.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={modalView !== null} onOpenChange={(open) => { if (!open) closeModal(); }}>
                <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-lg sm:max-w-3xl [&>button]:hidden">
                    <DialogTitle className="sr-only">
                        Treatment Protocol
                    </DialogTitle>

                    {modalView === "update" && (
                        <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col">
                            <TreatmentProtocolForm
                                initialData={protocol}
                                onSubmit={(data) => {
                                    updateMutation.mutate({ id: protocol.id, ...data }, { onSuccess: closeModal });
                                }}
                                onCancel={closeModal}
                                isPending={updateMutation.isPending}
                                error={updateMutation.error}
                            />
                        </div>
                    )}

                    {modalView === "addCriterion" && (
                        <div className="max-h-[90vh] overflow-hidden rounded-md flex flex-col max-w-lg mx-auto w-full">
                            <ProtocolCriterionForm
                                onSubmit={(data) => addCriterionMutation.mutate(data, { onSuccess: closeModal })}
                                onCancel={closeModal}
                                isPending={addCriterionMutation.isPending}
                                error={addCriterionMutation.error}
                            />
                        </div>
                    )}

                    {modalView === "delete" && (
                        <DeleteTreatmentProtocolPanel
                            item={protocol}
                            onConfirm={() => deleteMutation.mutate(protocol.id, { 
                                onSuccess: () => {
                                    closeModal();
                                    onBack();
                                }
                            })}
                            onCancel={closeModal}
                            isPending={deleteMutation.isPending}
                            error={deleteMutation.error}
                        />
                    )}

                    {modalView === "deleteCriterion" && criterionToDelete && (
                        <div className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200 max-w-lg mx-auto w-full">
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-red-50/50 rounded-t-md">
                                <h2 className="text-lg font-bold text-red-600">Remove Criterion</h2>
                            </div>
                            <div className="p-6 space-y-5 flex-1">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Are you sure you want to remove <strong className="text-red-600">{criterionToDelete.name}</strong> from this protocol?
                                </p>
                                {updateMutation.error && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600 font-bold">{updateMutation.error.message}</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-md">
                                <button type="button" onClick={closeModal} disabled={updateMutation.isPending} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="button" onClick={confirmDeleteCriterion} disabled={updateMutation.isPending} className="px-6 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50">
                                    {updateMutation.isPending ? "Removing..." : "Confirm Remove"}
                                </button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}