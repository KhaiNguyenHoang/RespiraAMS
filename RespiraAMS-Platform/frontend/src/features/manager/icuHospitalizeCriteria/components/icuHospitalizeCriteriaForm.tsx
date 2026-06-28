import { useEffect, useState } from "react";
import { CreateIcuCriteriaRequest, IcuHospitalizeCriterion } from "../models";
import { z } from "zod";
import { CriterionFormFields, CriterionFormState } from "../../diseases/components/criterionFormFields";
import { Switch } from "@/components/ui/switch";

const icuSchema = z.object({
    isMainCriteria: z.boolean(),
    criterion: z.object({
        name: z.string().trim().min(1, "Criterion name is required!"),
        type: z.enum(["Boolean", "Numeric"]),
        min: z.string().optional(),
        max: z.string().optional(),
        unit: z.string().optional(),
        isExclusive: z.boolean().optional(),
    })
}).superRefine((data, ctx) => {
    if (data.criterion.type === "Numeric") {
        const minVal = data.criterion.min ? parseFloat(data.criterion.min) : null;
        const maxVal = data.criterion.max ? parseFloat(data.criterion.max) : null;

        if (minVal !== null && maxVal !== null && minVal > maxVal) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Min value cannot be greater than Max value",
                path: ["criterion", "max"]
            });
        }
    }
});

interface IcuFormProps {
    initialData?: IcuHospitalizeCriterion | null;
    onSubmit: (data: CreateIcuCriteriaRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function IcuHospitalizeCriteriaForm({ initialData, onSubmit, onCancel, isPending, error: apiError }: IcuFormProps) {
    const isEdit = !!initialData;

    const [isMainCriteria, setIsMainCriteria] = useState(false);
    const [criterionObj, setCriterionObj] = useState<CriterionFormState>({
        name: "", type: "Boolean", min: "", max: "", unit: "", isExclusive: false
    });
    
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setIsMainCriteria(initialData.isMainCriteria);
            
            const apiType = initialData.criterion.type;
            const mappedType = apiType === "numeric" ? "Numeric" : "Boolean";
            
            setCriterionObj({
                name: initialData.criterion.name || "",
                type: mappedType,
                min: initialData.criterion.min?.toString() || "",
                max: initialData.criterion.max?.toString() || "",
                unit: initialData.criterion.unit || "",
                isExclusive: initialData.criterion.isExclusive || false
            });
        } else {
            setIsMainCriteria(false);
            setCriterionObj({ name: "", type: "Boolean", min: "", max: "", unit: "", isExclusive: false });
        }
        setFormErrors({});
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = { isMainCriteria, criterion: criterionObj };
        const result = icuSchema.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => errs[issue.path.join(".")] = issue.message);
            setFormErrors(errs);
            return;
        }

        setFormErrors({});

        const payload: CreateIcuCriteriaRequest = {
            isMainCriteria,
            criterion: {
                name: criterionObj.name,
                type: criterionObj.type,
                min: criterionObj.type === "Numeric" && criterionObj.min ? parseFloat(criterionObj.min) : null,
                max: criterionObj.type === "Numeric" && criterionObj.max ? parseFloat(criterionObj.max) : null,
                unit: criterionObj.type === "Numeric" ? (criterionObj.unit || null) : null,
                isExclusive: criterionObj.type === "Numeric" ? criterionObj.isExclusive : null
            }
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-md">
                <h2 className="text-lg font-bold text-gray-700">
                    {isEdit ? "Edit ICU Criterion" : "Add New ICU Criterion"}
                </h2>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <CriterionFormFields 
                    value={criterionObj} 
                    onChange={setCriterionObj} 
                    disabled={isPending}
                    errors={formErrors}
                    isEditMode={isEdit} 
                />

                <div className="border border-gray-200 rounded-md p-4 flex items-center space-x-4">
                    <Switch 
                        checked={isMainCriteria} 
                        onCheckedChange={setIsMainCriteria} 
                        disabled={isPending}
                        className="data-[state=checked]:bg-primary" 
                    />
                    <div>
                        <p className="text-sm font-bold text-gray-700">Is Main Criterion</p>
                        <p className="text-xs text-gray-500">Primary diagnostic marker for this disease.</p>
                    </div>
                </div>
                
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