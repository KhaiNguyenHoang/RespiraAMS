import { Button } from "@/components/ui/button";
import { DoctorItem } from "../models";

interface DeletePanelProps {
    doctor: DoctorItem;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function DeleteDoctorPanel({ doctor, onConfirm, onCancel, isPending, error }: DeletePanelProps) {
    return (
        <div className="flex flex-col bg-white rounded-md">
            <div className="space-y-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                    Are you sure you want to delete the doctor profile of <strong className="text-red-600">{doctor.firstName} {doctor.lastName}</strong>? This action will revoke their access to the system.
                </p>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600 font-bold">{error.message}</p>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <Button 
                    type="button" 
                    onClick={onCancel} 
                    disabled={isPending} 
                    variant="outline" 
                >
                    Cancel
                </Button>
                <Button 
                    type="button" 
                    variant="destructive"
                    onClick={onConfirm} 
                    disabled={isPending} 
                >
                    {isPending ? "Deleting..." : "Confirm Delete"}
                </Button>
            </div>
        </div>
    );
}