import { useState } from "react";
import { CreateAntibioticSpectrumRequest } from "../models";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CreateAntibioticSpectrumFormValue = CreateAntibioticSpectrumRequest;

interface CreateAntibioticSpectrumFormProps {
    onSubmit: (data: CreateAntibioticSpectrumFormValue) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function CreateAntibioticSpectrumForm({
    onSubmit,
    onCancel,
    isPending,
    error,
}: CreateAntibioticSpectrumFormProps) {
    const [form, setForm] = useState<CreateAntibioticSpectrumFormValue>({
        name: "",
        description: ""
    });

    const set = <K extends keyof CreateAntibioticSpectrumFormValue>(k: K, v: CreateAntibioticSpectrumFormValue[K]) =>
        setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ ...form });
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
                    {isPending ? "Creating..." : "Create"}
                </Button>
            </div>
        </form>
    );
}
