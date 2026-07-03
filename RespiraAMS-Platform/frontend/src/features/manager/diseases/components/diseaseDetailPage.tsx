"use client"

import { useDiseaseDetail } from "../queries";
import { DiseaseItem, DiseaseDetail } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { IcuHospitalizeCriteriaTable } from "../../icuHospitalizeCriteria/components/icuHospitalizeCriteriaTable";
import { ResistanceRisksTable } from "../../resistanceRisks/components/resistanceRisksTable";
import { DiseasePathogensTable } from "../../diseasePathogens/components/diseasePathogensTable";
import { TreatmentProtocolsTable } from "../../treatmentProtocols/components/treatmentProtocolsTable";
import { useState, useRef, useEffect } from "react";
import { useUpdateDisease, useDeleteDisease } from "@/features/manager/diseases/queries";

// IMPORT CÁC COMPONENT CẦN THIẾT
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import DiseaseForm from "./diseaseForm";
import DeleteDiseasePanel from "./deleteDiseasePanel";

interface DiseaseDetailViewProps {
    id: string;
    onBack: () => void;
}

type ModalView = "update" | "delete" | null;

export default function DiseaseDetailView({ id, onBack }: DiseaseDetailViewProps) {
    const { data: disease, isLoading, isError } = useDiseaseDetail(id);
    const router = useRouter();

    const [modalView, setModalView] = useState<ModalView>(null);
    const [selectedDisease, setSelectedDisease] = useState<DiseaseItem | null>(null);

    const searchParams = useSearchParams();
    const scrollTo = searchParams.get("scrollTo");
    const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);

    const updateMutation = useUpdateDisease();
    const deleteMutation = useDeleteDisease();
    const protocolTableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isLoading && disease && scrollTo === "protocols") {
            setAccordionValue("protocols");
            if (protocolTableRef.current) {
                setTimeout(() => {
                    protocolTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    router.replace(`/manager/diseases/${id}`, { scroll: false });
                }, 200);
            }
        }
    }, [isLoading, disease, scrollTo, id, router]);

    const openModal = (view: ModalView, item: any) => {
        setSelectedDisease(item);
        setModalView(view);
    };

    const closeModal = () => {
        setModalView(null);
        setSelectedDisease(null);
    };

    if (isLoading) return <Skeleton className="w-full h-[80vh] rounded-xl" />;
    if (isError || !disease) return <ErrorMessage error="Failed to load disease details" />;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">{disease.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => openModal("update", disease)} className="gap-2">
                            <Edit className="w-4 h-4" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => openModal("delete", disease)} className="gap-2">
                            <Trash className="w-4 h-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="mt-2">
                    <h3 className="text-sm font-semibold text-zinc-900 mb-1">Description</h3>
                    <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                        {disease.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="bg-zinc-50 p-4 rounded-lg border">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Required ICU Main Criteria</p>
                        <p className="text-xl font-bold mt-1 text-zinc-900">{disease.requiredIcuMainCriteria ?? "N/A"}</p>
                    </div>
                    <div className="bg-zinc-50 p-4 rounded-lg border">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Required ICU Secondary Criteria</p>
                        <p className="text-xl font-bold mt-1 text-zinc-900">{disease.requiredIcuSecondaryCriteria ?? "N/A"}</p>
                    </div>
                </div>
            </div>

            <Accordion 
                type="single" 
                collapsible 
                value={accordionValue} 
                onValueChange={setAccordionValue}
                className="w-full space-y-4"
            >
                <AccordionItem value="icu" className="bg-white rounded-xl border shadow-sm px-6 data-[state=open]:pb-6 border-b-0">
                    <AccordionTrigger className="hover:no-underline font-bold text-lg text-primary py-6">
                        ICU Hospitalize Criteria
                    </AccordionTrigger>
                    <AccordionContent>
                        <IcuHospitalizeCriteriaTable diseaseId={disease.id} criteria={disease.icuHospitalizeCriteria} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="risks" className="bg-white rounded-xl border shadow-sm px-6 data-[state=open]:pb-6 border-b-0">
                    <AccordionTrigger className="hover:no-underline font-bold text-lg text-primary py-6">
                        Resistance Risks
                    </AccordionTrigger>
                    <AccordionContent>
                        <ResistanceRisksTable diseaseId={id} risks={disease.resistanceRisks} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pathogens" className="bg-white rounded-xl border shadow-sm px-6 data-[state=open]:pb-6 border-b-0">
                    <AccordionTrigger className="hover:no-underline font-bold text-lg text-primary py-6">
                        Causes
                    </AccordionTrigger>
                    <AccordionContent>
                        <DiseasePathogensTable diseaseId={id} pathogens={disease.diseasePathogens} />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="protocols" className="bg-white rounded-xl border shadow-sm px-6 data-[state=open]:pb-6 border-b-0">
                    <div ref={protocolTableRef} className="scroll-mt-6">
                        <AccordionTrigger className="hover:no-underline font-bold text-lg text-primary py-6">
                            Treatment Protocols
                        </AccordionTrigger>
                        <AccordionContent>
                            <TreatmentProtocolsTable 
                                diseaseId={id} 
                                protocols={disease.treatmentProtocols} 
                                onView={(protocolId) => router.push(`/manager/diseases/${id}/protocols/${protocolId}`)}
                            />
                        </AccordionContent>
                    </div>
                </AccordionItem>
            </Accordion>

            <Dialog open={modalView === "update"} onOpenChange={(open) => { if (!open) closeModal(); }}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Update Disease</DialogTitle>
                        <DialogDescription>Modify the details of this disease.</DialogDescription>
                    </DialogHeader>

                    <div className="py-2">
                        {selectedDisease && (
                            <DiseaseForm
                                initialData={selectedDisease}
                                onSubmit={(data) => {
                                    updateMutation.mutate(
                                        { id: selectedDisease.id, ...data }, 
                                        { onSuccess: closeModal }
                                    );
                                }}
                                onCancel={closeModal}
                                isPending={updateMutation.isPending}
                                error={updateMutation.error}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <Sheet open={modalView === "delete"} onOpenChange={(open) => { if (!open) closeModal(); }}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Delete Disease</SheetTitle>
                        <SheetDescription>Confirm deletion of this record. This action cannot be undone.</SheetDescription>
                    </SheetHeader>

                    <div className="py-4 mt-4">
                        {selectedDisease && (
                            <DeleteDiseasePanel
                                disease={selectedDisease}
                                onConfirm={() => deleteMutation.mutate(
                                    selectedDisease.id, 
                                    { 
                                        onSuccess: () => {
                                            closeModal();
                                            router.push('/manager/diseases');
                                        }
                                    }
                                )}
                                onCancel={closeModal}
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