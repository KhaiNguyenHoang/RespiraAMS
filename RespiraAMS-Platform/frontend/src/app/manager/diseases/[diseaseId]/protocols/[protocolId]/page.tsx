"use client"

import { useParams, useRouter } from "next/navigation";
import TreatmentProtocolDetailView from "@/features/manager/treatmentProtocols/components/treatmentProtocolDetailPage"
export default function ProtocolDetailPage() {
    const params = useParams();
    const router = useRouter();
    
    const diseaseId = params.diseaseId as string;
    const protocolId = params.protocolId as string;

    if (!protocolId) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <TreatmentProtocolDetailView 
                diseaseId={diseaseId}
                id={protocolId} 
                onBack={() => {router.push(`/manager/diseases/${diseaseId}?scrollTo=protocols`)}} 
            />
        </div>
    );
}