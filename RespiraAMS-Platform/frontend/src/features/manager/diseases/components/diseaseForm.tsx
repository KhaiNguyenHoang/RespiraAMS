import { useEffect, useState } from "react";
import { CreateDiseaseRequest, DiseaseItem } from "../models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const diseaseSchema = z.object({
    name: z.string().trim().min(1, "Disease name is required!"),
    description: z.string().trim().min(5, "Description must be at least 5 characters!"),
    requiredIcuMainCriteria: z.coerce.number().min(1, "Must be greater than 0"),
    requiredIcuSecondaryCriteria: z.coerce.number().min(1, "Must be greater than 0")
});

interface DiseaseFormProps {
    initialData?: DiseaseItem | null;
    onSubmit: (data: CreateDiseaseRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function DiseaseForm({ initialData, onSubmit, onCancel, isPending, error: apiError }: DiseaseFormProps) {
    const isEdit = !!initialData;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [requiredIcuMainCriteria, setRequiredIcuMainCriteria] = useState<string>("0");
    const [requiredIcuSecondaryCriteria, setRequiredIcuSecondaryCriteria] = useState<string>("0");
    
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
            setRequiredIcuMainCriteria(initialData.requiredIcuMainCriteria?.toString() || "0");
            setRequiredIcuSecondaryCriteria(initialData.requiredIcuSecondaryCriteria?.toString() || "0");
        } else {
            setName("");
            setDescription("");
            setRequiredIcuMainCriteria("0");
            setRequiredIcuSecondaryCriteria("0");
        }
        setFormErrors({});
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = { 
            name, 
            description, 
            requiredIcuMainCriteria, 
            requiredIcuSecondaryCriteria 
        };
        
        const result = diseaseSchema.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                const issuePath = issue.path[0];
                if (typeof issuePath === "string") {
                    errs[issuePath] = issue.message;
                }
            });
            setFormErrors(errs);
            return;
        }

        setFormErrors({});
        onSubmit(result.data);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Disease Name <span className="text-red-500">*</span></label>
                <Input 
                    value={name} 
                    onChange={(e) => {
                        setName(e.target.value);
                        if (formErrors.name) setFormErrors(p => ({ ...p, name: "" }));
                    }} 
                    disabled={isPending} 
                    placeholder="E.g., Viêm phổi cộng đồng"
                    className={formErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {formErrors.name && <p className="text-sm text-red-500 font-medium">{formErrors.name}</p>}
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Description <span className="text-red-500">*</span></label>
                <textarea
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                        if (formErrors.description) setFormErrors(p => ({ ...p, description: "" }));
                    }}
                    disabled={isPending}
                    placeholder="Detailed information about the disease..."
                    className={`h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 ${formErrors.description ? "border-red-500 focus-visible:ring-red-500" : "border-input focus-visible:ring-ring"}`}
                />
                {formErrors.description && <p className="text-sm text-red-500 font-medium">{formErrors.description}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-medium">Required ICU Main Criteria <span className="text-red-500">*</span></label>
                    <Input 
                        type="number"
                        min="1"
                        value={requiredIcuMainCriteria} 
                        onChange={(e) => {
                            setRequiredIcuMainCriteria(e.target.value);
                            if (formErrors.requiredIcuMainCriteria) setFormErrors(p => ({ ...p, requiredIcuMainCriteria: "" }));
                        }} 
                        disabled={isPending} 
                        className={formErrors.requiredIcuMainCriteria ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.requiredIcuMainCriteria && <p className="text-sm text-red-500 font-medium">{formErrors.requiredIcuMainCriteria}</p>}
                </div>

                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-sm font-medium">Required ICU Secondary Criteria <span className="text-red-500">*</span></label>
                    <Input 
                        type="number"
                        min="1"
                        value={requiredIcuSecondaryCriteria} 
                        onChange={(e) => {
                            setRequiredIcuSecondaryCriteria(e.target.value);
                            if (formErrors.requiredIcuSecondaryCriteria) setFormErrors(p => ({ ...p, requiredIcuSecondaryCriteria: "" }));
                        }} 
                        disabled={isPending} 
                        className={formErrors.requiredIcuSecondaryCriteria ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {formErrors.requiredIcuSecondaryCriteria && <p className="text-sm text-red-500 font-medium">{formErrors.requiredIcuSecondaryCriteria}</p>}
                </div>
            </div>

            {apiError && <p className="text-sm text-destructive font-medium">{apiError.message}</p>}

            <div className="flex gap-2 justify-end mt-4 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : (isEdit ? "Update" : "Create")}
                </Button>
            </div>
        </form>
    );
}