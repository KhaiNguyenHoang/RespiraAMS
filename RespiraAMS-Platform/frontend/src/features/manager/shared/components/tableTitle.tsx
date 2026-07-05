import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TableTitle({ title, onClick }: { title: string, onClick: () => void }) {
    return (
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Button onClick={onClick} className="gap-2">
                <Plus className="h-4 w-4" />Thêm
            </Button>
        </div>
    )
}