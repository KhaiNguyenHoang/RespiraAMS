import { useState } from "react";
import { z } from "zod";
import { CriterionFormFields, CriterionFormState } from "../../diseases/components/criterionFormFields";
import { AddProtocolCriteriaRequest } from "../models";

const criteriaSchema = z.object({
    name: z.string().trim().min(1, "Criterion name is required!"),
    type: z.enum(["Boolean", "Numeric"]),
    min: z.string().optional(),
    max: z.string().optional(),
    unit: z.string().optional(),
    isExclusive: z.boolean().optional(),
}).superRefine((data, ctx) => {
    if (data.type === "Numeric") {
        const minVal = data.min ? parseFloat(data.min) : null;
        const maxVal = data.max ? parseFloat(data.max) : null;
        if (minVal !== null && maxVal !== null && minVal >= maxVal) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Min value cannot be greater than Max value", path: ["max"] });
        }
    }
});

interface ProtocolCriterionFormProps {
    onSubmit: (data: AddProtocolCriteriaRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function ProtocolCriterionForm({ onSubmit, onCancel, isPending, error: apiError }: ProtocolCriterionFormProps) {
    const [criterionObj, setCriterionObj] = useState<CriterionFormState>({
        name: "", type: "Boolean", min: "", max: "", unit: "", isExclusive: false
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const result = criteriaSchema.safeParse(criterionObj);
        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => errs[`criterion.${issue.path[0] as string}`] = issue.message);
            setFormErrors(errs);
            return;
        }

        setFormErrors({});

        const payload: AddProtocolCriteriaRequest = {
            criteria: [{
                name: criterionObj.name,
                type: criterionObj.type,
                min: criterionObj.type === "Numeric" && criterionObj.min ? parseFloat(criterionObj.min) : null,
                max: criterionObj.type === "Numeric" && criterionObj.max ? parseFloat(criterionObj.max) : null,
                unit: criterionObj.type === "Numeric" ? (criterionObj.unit || null) : null,
                isExclusive: criterionObj.type === "Numeric" ? criterionObj.isExclusive : null
            }]
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-md">
                <h2 className="text-lg font-bold text-gray-700">Add New Criterion</h2>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <CriterionFormFields 
                    value={criterionObj} 
                    onChange={setCriterionObj} 
                    disabled={isPending}
                    errors={formErrors}
                />
                {apiError && <p className="text-sm text-red-500 font-bold">{apiError.message}</p>}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-md">
                <button type="button" onClick={onCancel} disabled={isPending} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-primary bg-white hover:bg-gray-50 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-6 py-2 rounded-md text-sm font-bold text-white bg-primary hover:opacity-90 transition disabled:opacity-50">
                    {isPending ? "Saving..." : "Save Criterion"}
                </button>
            </div>
        </form>
    );
}