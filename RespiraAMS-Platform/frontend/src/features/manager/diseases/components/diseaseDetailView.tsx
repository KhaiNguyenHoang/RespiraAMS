"use client"

import { useDiseaseDetail } from "../queries";
import { DiseaseDetail } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ArrowLeft } from "lucide-react";

import { IcuHospitalizeCriteriaTable } from "./icuHospitalizeCriteria/icuHospitalizeCriteriaTable";
import { ResistanceRisksTable } from "./resistanceRisks/resistanceRisksTable";
import { DiseasePathogensTable } from "./diseasePathogens/diseasePathogensTable";
import { TreatmentProtocolsTable } from "./treatmentProtocols/treatmentProtocolsTable";

interface DiseaseDetailViewProps {
    id: string;
    onBack: () => void;
    onEditDisease: (disease: DiseaseDetail) => void;
    onDeleteDisease: (disease: DiseaseDetail) => void;
}

export default function DiseaseDetailView({ id, onBack, onEditDisease, onDeleteDisease }: DiseaseDetailViewProps) {
    const { data: disease, isLoading, isError } = useDiseaseDetail(id);

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
                        {/* QUAN TRỌNG: Quăng biến 'disease' vào đây để ngoài kia nó hứng */}
                        <Button variant="outline" onClick={() => onEditDisease(disease)} className="gap-2">
                            <Edit className="w-4 h-4" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => onDeleteDisease(disease)} className="gap-2">
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
            <ResistanceRisksTable risks={disease.resistanceRisks} />
            <DiseasePathogensTable pathogens={disease.diseasePathogens} />
            <TreatmentProtocolsTable protocols={disease.treatmentProtocols} />

        </div>
    );
}