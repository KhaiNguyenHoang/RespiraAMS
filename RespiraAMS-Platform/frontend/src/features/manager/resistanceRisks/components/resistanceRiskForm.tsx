import { useEffect, useState, useRef } from "react";
import { CreateResistanceRiskRequest, ResistanceRisk } from "../../resistanceRisks/models";
import { usePathogensList } from "../../pathogens/queries";
import { z } from "zod";
import { CriterionFormFields, CriterionFormState } from "../../diseases/components/criterionFormFields";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Check } from "lucide-react";

const riskSchema = z.object({
    name: z.string().trim().min(1, "Risk name is required!"),
    pathogenId: z.string().trim().min(1, "Please select a pathogen!"),
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
        if (minVal !== null && maxVal !== null && minVal >= maxVal) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Min value cannot be greater than Max value",
                path: ["criterion", "max"]
            });
        }
    }
});

interface RiskFormProps {
    initialData?: ResistanceRisk | null;
    onSubmit: (data: CreateResistanceRiskRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function ResistanceRiskForm({ initialData, onSubmit, onCancel, isPending, error: apiError }: RiskFormProps) {
    const isEdit = !!initialData;

    const { data: pathogensList, isLoading: isPathogensLoading } = usePathogensList();

    const [name, setName] = useState("");
    const [pathogenId, setPathogenId] = useState("");
    const [criterionObj, setCriterionObj] = useState<CriterionFormState>({
        name: "", type: "Boolean", min: "", max: "", unit: "", isExclusive: false
    });
    
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [pathogenSearch, setPathogenSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || "");
            const mappedPathogenId = pathogensList?.find(p => p.name === initialData.pathogen)?.id || "";
            setPathogenId(mappedPathogenId);

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
            setName("");
            setPathogenId("");
            setCriterionObj({ name: "", type: "Boolean", min: "", max: "", unit: "", isExclusive: false });
        }
        setFormErrors({});
    }, [initialData, pathogensList]);

    const filteredPathogens = pathogensList?.filter(p => 
        p.name.toLowerCase().includes(pathogenSearch.toLowerCase())
    ) || [];

    const selectedPathogenObj = pathogensList?.find(p => p.id === pathogenId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = { name, pathogenId, criterion: criterionObj };
        const result = riskSchema.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => errs[issue.path.join(".")] = issue.message);
            setFormErrors(errs);
            return;
        }

        setFormErrors({});

        const payload: CreateResistanceRiskRequest = {
            name,
            pathogenId,
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
                    {isEdit ? "Edit Resistance Risk" : "Add New Resistance Risk"}
                </h2>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Risk Name */}
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Risk Name <span className="text-red-500">*</span></label>
                    <Input 
                        value={name} 
                        onChange={(e) => {
                            setName(e.target.value);
                            if (formErrors.name) setFormErrors(p => ({ ...p, name: "" }));
                        }} 
                        disabled={isPending}
                        placeholder="e.g. CA-MRSA"
                        className={`block w-full border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700 focus:ring-primary focus:border-primary ${formErrors.name ? "border-red-500" : ""}`}
                    />
                    {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Pathogen <span className="text-red-500">*</span></label>
                    <div 
                        className={`flex items-center justify-between w-full border rounded-md py-2 px-3 text-sm cursor-pointer bg-white ${formErrors.pathogenId ? "border-red-500" : "border-gray-300"} ${isPending ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span className={selectedPathogenObj ? "text-gray-900" : "text-gray-400"}>
                            {isPathogensLoading ? "Loading pathogens..." : (selectedPathogenObj?.name || "Select a pathogen...")}
                        </span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                    {formErrors.pathogenId && <p className="text-xs text-red-500 mt-1">{formErrors.pathogenId}</p>}

                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            <div className="p-2 border-b flex items-center gap-2">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={pathogenSearch}
                                    onChange={(e) => setPathogenSearch(e.target.value)}
                                    placeholder="Search pathogen..."
                                    className="w-full text-sm outline-none bg-transparent"
                                />
                            </div>
                            <ul className="max-h-60 overflow-y-auto p-1">
                                {filteredPathogens.length > 0 ? filteredPathogens.map(p => (
                                    <li 
                                        key={p.id} 
                                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex justify-between items-center"
                                        onClick={() => {
                                            setPathogenId(p.id);
                                            setIsDropdownOpen(false);
                                            setPathogenSearch("");
                                            if (formErrors.pathogenId) setFormErrors(errs => ({ ...errs, pathogenId: "" }));
                                        }}
                                    >
                                        {p.name}
                                        {pathogenId === p.id && <Check className="w-4 h-4 text-primary" />}
                                    </li>
                                )) : (
                                    <li className="px-3 py-2 text-sm text-gray-500 text-center">No pathogens found.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="border-t pt-4">
                    <h3 className="text-sm font-bold text-primary mb-4">Criterion Details</h3>
                    <CriterionFormFields 
                        value={criterionObj} 
                        onChange={setCriterionObj} 
                        disabled={isPending}
                        errors={formErrors}
                        isEditMode={isEdit}
                    />
                </div>
                
                {apiError && <p className="text-sm text-red-500 font-bold">{apiError.message}</p>}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-md">
                <button type="button" onClick={onCancel} disabled={isPending} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-primary bg-white hover:bg-gray-50 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-6 py-2 rounded-md text-sm font-bold text-white bg-primary hover:opacity-90 transition disabled:opacity-50">
                    {isPending ? "Saving..." : "Save Risk"}
                </button>
            </div>
        </form>
    );
}