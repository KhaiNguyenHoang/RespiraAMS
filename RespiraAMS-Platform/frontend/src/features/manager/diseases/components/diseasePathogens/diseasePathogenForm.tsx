import { useEffect, useState, useRef } from "react";
import { CreateDiseasePathogenRequest, DiseasePathogen, Severity, TreatmentSite } from "../../diseasePathogens/models";
import { usePathogensList } from "../../../pathogens/queries";
import { z } from "zod";
import { Search, ChevronDown, Check } from "lucide-react";

const pathogenSchema = z.object({
    pathogenId: z.string().trim().min(1, "Please select a pathogen!"),
    severity: z.string().min(1, "Severity is required!"),
    treatmentSite: z.string().min(1, "Treatment site is required!"),
});

interface DiseasePathogenFormProps {
    initialData?: DiseasePathogen | null;
    existingPathogens?: DiseasePathogen[];
    onSubmit: (data: CreateDiseasePathogenRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function DiseasePathogenForm({ initialData, existingPathogens = [], onSubmit, onCancel, isPending, error: apiError }: DiseasePathogenFormProps) {
    const isEdit = !!initialData;
    const { data: pathogensList, isLoading: isPathogensLoading } = usePathogensList();

    const [pathogenId, setPathogenId] = useState("");
    const [severity, setSeverity] = useState<Severity | string>("");
    const [treatmentSite, setTreatmentSite] = useState<TreatmentSite | string>("");
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
            const mappedPathogenId = pathogensList?.find(p => p.name === initialData.pathogen)?.id || initialData.pathogen;
            setPathogenId(mappedPathogenId);
            setSeverity(initialData.severity || "");
            setTreatmentSite(initialData.treatmentSite || "");
        } else {
            setPathogenId("");
            setSeverity("");
            setTreatmentSite("");
        }
        setFormErrors({});
    }, [initialData, pathogensList]);

    const existingNames = existingPathogens.map(ep => ep.pathogen);
    
    const filteredPathogens = pathogensList?.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(pathogenSearch.toLowerCase());
        
        const isAlreadyAdded = existingNames.includes(p.name);
        const isCurrentEditItem = isEdit && p.name === initialData?.pathogen;
        
        return matchSearch && (!isAlreadyAdded || isCurrentEditItem);
    }) || [];

    const selectedPathogenObj = pathogensList?.find(p => p.id === pathogenId);
    const displayPathogenName = selectedPathogenObj ? selectedPathogenObj.name : (isEdit ? initialData?.pathogen : "Select a pathogen...");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = { pathogenId, severity, treatmentSite };
        const result = pathogenSchema.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => errs[issue.path[0] as string] = issue.message);
            setFormErrors(errs);
            return;
        }

        setFormErrors({});
        onSubmit({
            pathogenId,
            severity,
            treatmentSite
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-md">
                <h2 className="text-lg font-bold text-gray-700">
                    {isEdit ? "Edit Disease Cause" : "Add Cause"}
                </h2>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">

                <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Pathogen <span className="text-red-500">*</span></label>
                    <div 
                        className={`flex items-center justify-between w-full border rounded-md py-2 px-3 text-sm transition bg-white 
                            ${formErrors.pathogenId ? "border-red-500" : "border-gray-300"} 
                            ${isPending || isEdit ? "opacity-60 bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
                        `}
                        onClick={() => {
                            if (!isPending && !isEdit) setIsDropdownOpen(!isDropdownOpen);
                        }}
                    >
                        <span className={pathogenId || isEdit ? "text-gray-900" : "text-gray-400"}>
                            {isPathogensLoading ? "Loading pathogens..." : displayPathogenName}
                        </span>
                        {!isEdit && <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                    {formErrors.pathogenId && <p className="text-xs text-red-500 mt-1">{formErrors.pathogenId}</p>}

                    {isDropdownOpen && !isEdit && (
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
                                            if (formErrors.pathogenId) setFormErrors(e => ({ ...e, pathogenId: "" }));
                                        }}
                                    >
                                        {p.name}
                                        {pathogenId === p.id && <Check className="w-4 h-4 text-primary" />}
                                    </li>
                                )) : (
                                    <li className="px-3 py-2 text-sm text-gray-500 text-center">No more available pathogens.</li>
                                )}
                            </ul>
                        </div>
                    )}
                    {isEdit && <p className="text-xs text-gray-400 mt-1 italic">Pathogen cannot be changed.</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Severity <span className="text-red-500">*</span></label>
                    <select 
                        value={severity} 
                        onChange={(e) => {
                            setSeverity(e.target.value);
                            if (formErrors.severity) setFormErrors(p => ({ ...p, severity: "" }));
                        }}
                        disabled={isPending}
                        className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0c3660] focus:border-[#0c3660] ${formErrors.severity ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="" disabled>-- Select Severity --</option>
                        {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {formErrors.severity && <p className="text-xs text-red-500 mt-1">{formErrors.severity}</p>}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Treatment Site <span className="text-red-500">*</span></label>
                    <select 
                        value={treatmentSite} 
                        onChange={(e) => {
                            setTreatmentSite(e.target.value);
                            if (formErrors.treatmentSite) setFormErrors(p => ({ ...p, treatmentSite: "" }));
                        }}
                        disabled={isPending}
                        className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0c3660] focus:border-[#0c3660] ${formErrors.treatmentSite ? "border-red-500" : "border-gray-300"}`}
                    >
                        <option value="" disabled>-- Select Treatment Site --</option>
                        {Object.values(TreatmentSite).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {formErrors.treatmentSite && <p className="text-xs text-red-500 mt-1">{formErrors.treatmentSite}</p>}
                </div>

                {apiError && <p className="text-sm text-red-500 font-bold">{apiError.message}</p>}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-md">
                <button type="button" onClick={onCancel} disabled={isPending} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-[#0c3660] bg-white hover:bg-gray-50 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-6 py-2 rounded-md text-sm font-bold text-white bg-[#0c3660] hover:opacity-90 transition disabled:opacity-50">
                    {isPending ? "Saving..." : "Save Cause"}
                </button>
            </div>
        </form>
    );
}