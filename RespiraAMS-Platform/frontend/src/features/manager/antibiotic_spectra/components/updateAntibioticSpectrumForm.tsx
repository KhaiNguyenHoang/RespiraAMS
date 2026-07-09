import { useState } from "react";
import { AntibioticSpectrumItem, UpdateAntibioticSpectrumRequest } from "../models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UpdateAntibioticSpectrumFormValue = Omit<UpdateAntibioticSpectrumRequest, "id">;

interface UpdateAntibioticSpectrumFormProps {
    initialValues: AntibioticSpectrumItem;
    onSubmit: (data: UpdateAntibioticSpectrumRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function UpdateAntibioticSpectrumForm({
    initialValues,
    onSubmit,
    onCancel,
    isPending,
    error,
}: UpdateAntibioticSpectrumFormProps) {
    const [form, setForm] = useState<UpdateAntibioticSpectrumFormValue>({
        name: initialValues.name,
        description: initialValues.description,
    });

    const set = <K extends keyof UpdateAntibioticSpectrumFormValue>(k: K, v: UpdateAntibioticSpectrumFormValue[K]) =>
        setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ id: initialValues.id, ...form });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                    id="name"
                    placeholder="Enter spectrum name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    disabled={isPending}
                    required
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <textarea
                    id="description"
                    placeholder="Enter spectrum description"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    disabled={isPending}
                    className="h-24 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-y md:text-sm dark:bg-input/30"
                    required
                />
            </div>

            {error && (
                <p className="text-sm text-destructive">{error.message}</p>
            )}

            <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Updating..." : "Update"}
                </Button>
            </div>
        </form>
    );
}
