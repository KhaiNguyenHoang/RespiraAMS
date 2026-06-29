import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function LoadingDiseaseDetail() {
    return (
        <div className="container mx-auto flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
            <div className="flex items-center justify-between">
                <Button variant="ghost" disabled className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Disease
                </Button>
            </div>
            
            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
                <Skeleton className="h-20 w-full mt-4" />
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>

            <Skeleton className="h-64 w-full rounded-xl" />
        </div>
    );
}