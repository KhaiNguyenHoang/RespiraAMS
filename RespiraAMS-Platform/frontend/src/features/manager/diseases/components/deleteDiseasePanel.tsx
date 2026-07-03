import { DiseaseItem } from "../models";
import { Button } from "@/components/ui/button";

interface DeleteDiseasePanelProps {
    disease: DiseaseItem;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function DeleteDiseasePanel({ disease, onConfirm, onCancel, isPending, error }: DeleteDiseasePanelProps) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-600">
                Are you sure you want to delete <strong className="text-red-600">{disease.name}</strong>? This action cannot be undone.
            </p>

            {error && (
                <p className="text-sm text-destructive font-medium">{error.message}</p>
            )}

            <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
                    {isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
            </div>
        </div>
    );
}