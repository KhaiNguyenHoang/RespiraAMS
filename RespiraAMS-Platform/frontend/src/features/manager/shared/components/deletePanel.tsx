import { ErrorMessage } from "@/components/custom/error";
import { Button } from "@/components/ui/button";

export interface DeleteItemProps {
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

/**
 * Delete panel for all the delete sheet, which contains cancel and delete buttons, and error message 
 * if any.
 */
export function DeletePanel({
    onConfirm,
    onCancel,
    isPending,
    error,
}: DeleteItemProps) {
    return (
        <div className="flex flex-col gap-4 px-1">
            {error && <ErrorMessage error={error.message} />}

            <div className="flex gap-2 justify-end">
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