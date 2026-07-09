"use client"

import { useParams, useRouter } from "next/navigation";
import DiseaseDetailView from "@/features/manager/diseases/components/diseaseDetailPage";

export default function DiseaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    
    const diseaseId = params.diseaseId as string;

    if (!diseaseId) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <DiseaseDetailView 
                id={diseaseId} 
                onBack={() => router.push('/manager/diseases')}
            />
        </div>
    );
}