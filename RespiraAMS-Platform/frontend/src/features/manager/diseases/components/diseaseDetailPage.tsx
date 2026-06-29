"use client"

import { useDiseaseDetail } from "../queries";
import { DiseaseDetail } from "../models";
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
import { DiseaseItem } from "../models"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import DiseaseForm from "./diseaseForm";
import DeleteDiseasePanel from "./deleteDiseasePanel";

interface DiseaseDetailViewProps {
    id: string;
    onBack: () => void;
}
type SheetView = "update" | "delete" | null;

export default function DiseaseDetailView({ id, onBack}: DiseaseDetailViewProps) {
    const { data: disease, isLoading, isError } = useDiseaseDetail(id);
    const router = useRouter();

    const [sheetView, setSheetView] = useState<SheetView>(null);
    const [selectedDisease, setSelectedDisease] = useState<DiseaseItem | null>(null);

    const updateMutation = useUpdateDisease();
    const deleteMutation = useDeleteDisease();

    const searchParams = useSearchParams();
    const scrollTo = searchParams.get("scrollTo");
    const protocolTableRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!isLoading && disease && scrollTo === "protocols" && protocolTableRef.current) {
            setTimeout(() => {
                protocolTableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                router.replace(`/manager/diseases/${id}`, { scroll: false });
            }, 100);
        }
    }, [isLoading, disease, scrollTo, id, router]);


    const openSheet = (view: SheetView, item: DiseaseItem) => {
        setSelectedDisease(item);
        setSheetView(view);
    };

    const closeSheet = () => {
        setSheetView(null);
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
                        <Button variant="outline" onClick={() => openSheet("update", disease)} className="gap-2">
                            <Edit className="w-4 h-4" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => openSheet("delete", disease)} className="gap-2">
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

            <IcuHospitalizeCriteriaTable diseaseId={disease.id} criteria={disease.icuHospitalizeCriteria} />
            <ResistanceRisksTable diseaseId={id} risks={disease.resistanceRisks} />
            <DiseasePathogensTable diseaseId={id} pathogens={disease.diseasePathogens} />
            
            <div ref={protocolTableRef} className="scroll-mt-6">
                <TreatmentProtocolsTable 
                    diseaseId={id} 
                    protocols={disease.treatmentProtocols} 
                    onView={(protocolId) => router.push(`/manager/diseases/${id}/protocols/${protocolId}`)}
                />
            </div>


            <Sheet open={sheetView !== null} onOpenChange={(open) => { if (!open) closeSheet(); }}>
                <SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
                    <SheetHeader>
                        <SheetTitle>
                            {sheetView === "update" && "Update Disease"}
                            {sheetView === "delete" && "Delete Disease"}
                        </SheetTitle>
                        <SheetDescription>
                            {sheetView === "update" && "Modify the details of this disease."}
                            {sheetView === "delete" && "Confirm deletion of this record."}
                        </SheetDescription>
                    </SheetHeader>

                    <div className="p-4 mt-2">
                        {sheetView === "update" && selectedDisease && (
                            <DiseaseForm
                                initialData={selectedDisease}
                                onSubmit={(data) => {
                                    updateMutation.mutate(
                                        { id: selectedDisease.id, ...data }, 
                                        { onSuccess: closeSheet }
                                    );
                                }}
                                onCancel={closeSheet}
                                isPending={updateMutation.isPending}
                                error={updateMutation.error}
                            />
                        )}

                        {sheetView === "delete" && selectedDisease && (
                            <DeleteDiseasePanel
                                disease={selectedDisease}
                                onConfirm={() => deleteMutation.mutate(
                                    selectedDisease.id, 
                                    { 
                                        onSuccess: () => {
                                            closeSheet();
                                            router.push('/manager/diseases');
                                        }
                                    }
                                )}
                                onCancel={closeSheet}
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