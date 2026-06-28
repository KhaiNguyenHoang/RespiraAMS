import { IcuHospitalizeCriterion } from "../models";

interface DeleteIcuCriterionPanelProps {
    item: IcuHospitalizeCriterion;
    onConfirm: () => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function DeleteIcuCriterionPanel({ item, onConfirm, onCancel, isPending, error }: DeleteIcuCriterionPanelProps) {
    return (
        <div className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-red-50/50 rounded-t-md">
                <h2 className="text-lg font-bold text-red-600">
                    Delete ICU Criterion
                </h2>
            </div>

            <div className="p-6 space-y-5 flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                    Are you sure you want to delete the criterion <strong className="text-red-600">{item.criterion.name}</strong>? This action cannot be undone.
                </p>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600 font-bold">{error.message}</p>
                    </div>
                )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-md">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    disabled={isPending} 
                    className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
                <button 
                    type="button" 
                    onClick={onConfirm} 
                    disabled={isPending} 
                    className="px-6 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
                >
                    {isPending ? "Deleting..." : "Confirm Delete"}
                </button>
            </div>
        </div>
    );
}