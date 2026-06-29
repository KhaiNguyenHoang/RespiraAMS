import { useEffect, useState } from "react";
import { CreatePathogenRequest, PathogenItem } from "../models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";

const pathogenSchema = z.object({
    name: z.string().trim().min(1, "Please enter the pathogen name!"),
    description: z.string().trim().min(1, "Please enter the description!")
});

interface PathogenFormProps {
    initialData?: PathogenItem | null;
    onSubmit: (data: CreatePathogenRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function PathogenForm({ initialData, onSubmit, onCancel, isPending, error: apiError }: PathogenFormProps) {
    const isEdit = !!initialData;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            setDescription(initialData.description || "");
        } else {
            setName("");
            setDescription("");
        }
        setFormErrors({});
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = { name, description };
        const result = pathogenSchema.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => {
                const key = issue.path[0];
                if (typeof key === "string") {
                    errs[key] = issue.message;
                }
            });
            setFormErrors(errs);
            return;
        }

        setFormErrors({});
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Pathogen Name <span className="text-red-500">*</span></label>
                <Input 
                    value={name} 
                    onChange={(e) => {
                        setName(e.target.value);
                        if (formErrors.name) setFormErrors(p => ({ ...p, name: "" }));
                    }} 
                    disabled={isPending} 
                    placeholder="e.g., Streptococcus pneumoniae"
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
                    placeholder="Enter detailed information about the pathogen..."
                    className={`h-32 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 ${formErrors.description ? "border-red-500 focus-visible:ring-red-500" : "border-input focus-visible:ring-ring"}`}
                />
                {formErrors.description && <p className="text-sm text-red-500 font-medium">{formErrors.description}</p>}
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