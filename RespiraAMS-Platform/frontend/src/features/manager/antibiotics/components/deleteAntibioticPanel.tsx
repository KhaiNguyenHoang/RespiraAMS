import { AntibioticItem } from "../models";
import { Button } from "@/components/ui/button";

interface DeleteAntibioticPanelProps {
    antibiotic: AntibioticItem;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function DeleteAntibioticPanel({ antibiotic, onConfirm, onCancel, isPending, error }: DeleteAntibioticPanelProps) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
                Are you sure you want to delete the antibiotic <strong className="text-red-600">{antibiotic.name}</strong>? This action cannot be undone.
            </p>

            {error && (
                <p className="text-sm text-destructive">{error.message}</p>
            )}

            <div className="flex gap-2 justify-end mt-4">
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