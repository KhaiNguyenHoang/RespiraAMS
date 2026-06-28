import { useEffect, useState, useRef } from "react";
import { CreateTreatmentProtocolRequest} from "../../treatmentProtocols/models";
import {Severity, TreatmentSite} from "../../diseasePathogens/models"
import { usePathogensList } from "../../../pathogens/queries";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const protocolSchema = z.object({
    name: z.string().trim().min(1, "Protocol name is required!"),
    issuer: z.string().trim().min(1, "Issuer is required! (e.g., WHO)"),
    issueDate: z.string().min(1, "Please select an issue date!").refine((dateStr) => {
        const selectedDate = new Date(dateStr);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return selectedDate <= today;
    }, "Issue date cannot be in the future!"),
    version: z.coerce.number().int().min(1, "Version must be an integer >= 1"),
    severity: z.string().min(1, "Severity is required!"),
    treatmentSite: z.string().min(1, "Treatment site is required!"),
    specialInfectionId: z.string().nullable().optional()
});

interface ProtocolFormProps {
    onSubmit: (data: CreateTreatmentProtocolRequest) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function TreatmentProtocolForm({ onSubmit, onCancel, isPending, error: apiError }: ProtocolFormProps) {
    const { data: pathogensList, isLoading: isPathogensLoading } = usePathogensList();

    const [name, setName] = useState("");
    const [issuer, setIssuer] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [version, setVersion] = useState("1");
    const [severity, setSeverity] = useState<Severity | string>("");
    const [treatmentSite, setTreatmentSite] = useState<TreatmentSite | string>("");
    const [specialInfectionId, setSpecialInfectionId] = useState<string | null>(null);

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

    const filteredPathogens = pathogensList?.filter(p => 
        p.name.toLowerCase().includes(pathogenSearch.toLowerCase())
    ) || [];

    const selectedPathogenObj = pathogensList?.find(p => p.id === specialInfectionId);
    const displayPathogenName = selectedPathogenObj ? selectedPathogenObj.name : "None (Select if applicable)...";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = { name, issuer, issueDate, version, severity, treatmentSite, specialInfectionId };
        const result = protocolSchema.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => errs[issue.path[0] as string] = issue.message);
            setFormErrors(errs);
            return;
        }

        setFormErrors({});

        onSubmit({
            name,
            issuer,
            issueDate,
            version: parseInt(version),
            severity,
            treatmentSite,
            specialInfectionId,
            otherCriteriaIds: [],
            medicineIds: []
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200" noValidate>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-md">
                <h2 className="text-lg font-bold text-gray-700">Add Treatment Protocol</h2>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Protocol Name <span className="text-red-500">*</span></label>
                        <Input 
                            value={name} onChange={(e) => { setName(e.target.value); if (formErrors.name) setFormErrors(p => ({ ...p, name: "" })); }} 
                            disabled={isPending} placeholder="e.g. Phác đồ điều trị VPCĐ"
                            className={formErrors.name ? "border-red-500" : ""}
                        />
                        {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Issuer <span className="text-red-500">*</span></label>
                        <Input 
                            value={issuer} onChange={(e) => { setIssuer(e.target.value); if (formErrors.issuer) setFormErrors(p => ({ ...p, issuer: "" })); }} 
                            disabled={isPending} placeholder="e.g. WHO"
                            className={formErrors.issuer ? "border-red-500" : ""}
                        />
                        {formErrors.issuer && <p className="text-xs text-red-500 mt-1">{formErrors.issuer}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Issue Date <span className="text-red-500">*</span></label>
                        <Input 
                            type="date"
                            value={issueDate} onChange={(e) => { setIssueDate(e.target.value); if (formErrors.issueDate) setFormErrors(p => ({ ...p, issueDate: "" })); }} 
                            disabled={isPending}
                            className={formErrors.issueDate ? "border-red-500 text-red-500" : ""}
                        />
                        {formErrors.issueDate && <p className="text-xs text-red-500 mt-1">{formErrors.issueDate}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Version <span className="text-red-500">*</span></label>
                        <Input 
                            type="number" min="1"
                            value={version} onChange={(e) => { setVersion(e.target.value); if (formErrors.version) setFormErrors(p => ({ ...p, version: "" })); }} 
                            disabled={isPending}
                            className={formErrors.version ? "border-red-500" : ""}
                        />
                        {formErrors.version && <p className="text-xs text-red-500 mt-1">{formErrors.version}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Severity <span className="text-red-500">*</span></label>
                        <select 
                            value={severity} 
                            onChange={(e) => { setSeverity(e.target.value); if (formErrors.severity) setFormErrors(p => ({ ...p, severity: "" })); }}
                            disabled={isPending}
                            className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary ${formErrors.severity ? "border-red-500" : "border-gray-300"}`}
                        >
                            <option value="" disabled>-- Select --</option>
                            {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {formErrors.severity && <p className="text-xs text-red-500 mt-1">{formErrors.severity}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Treatment Site <span className="text-red-500">*</span></label>
                        <select 
                            value={treatmentSite} 
                            onChange={(e) => { setTreatmentSite(e.target.value); if (formErrors.treatmentSite) setFormErrors(p => ({ ...p, treatmentSite: "" })); }}
                            disabled={isPending}
                            className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary ${formErrors.treatmentSite ? "border-red-500" : "border-gray-300"}`}
                        >
                            <option value="" disabled>-- Select --</option>
                            {Object.values(TreatmentSite).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {formErrors.treatmentSite && <p className="text-xs text-red-500 mt-1">{formErrors.treatmentSite}</p>}
                    </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Special Infection (Pathogen) <span className="text-zinc-400 font-normal italic">- Optional</span></label>
                    <div className="flex items-center gap-2">
                        <div 
                            className={`flex items-center justify-between w-full border rounded-md py-2 px-3 text-sm transition bg-white border-gray-300 ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                            onClick={() => { if (!isPending) setIsDropdownOpen(!isDropdownOpen); }}
                        >
                            <span className={specialInfectionId ? "text-gray-900" : "text-gray-400"}>
                                {isPathogensLoading ? "Loading pathogens..." : displayPathogenName}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                        {specialInfectionId && (
                            <Button type="button" variant="outline" size="icon" onClick={() => setSpecialInfectionId(null)} title="Clear Selection">
                                <X className="w-4 h-4 text-gray-500" />
                            </Button>
                        )}
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            <div className="p-2 border-b flex items-center gap-2">
                                <Search className="w-4 h-4 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={pathogenSearch} onChange={(e) => setPathogenSearch(e.target.value)}
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
                                            setSpecialInfectionId(p.id);
                                            setIsDropdownOpen(false);
                                            setPathogenSearch("");
                                        }}
                                    >
                                        {p.name}
                                        {specialInfectionId === p.id && <Check className="w-4 h-4 text-primary" />}
                                    </li>
                                )) : (
                                    <li className="px-3 py-2 text-sm text-gray-500 text-center">No pathogens found.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {apiError && <p className="text-sm text-red-500 font-bold">{apiError.message}</p>}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-md">
                <button type="button" onClick={onCancel} disabled={isPending} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-primary bg-white hover:bg-gray-50 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-6 py-2 rounded-md text-sm font-bold text-white bg-primary hover:opacity-90 transition disabled:opacity-50">
                    {isPending ? "Saving..." : "Save Protocol"}
                </button>
            </div>
        </form>
    );
}