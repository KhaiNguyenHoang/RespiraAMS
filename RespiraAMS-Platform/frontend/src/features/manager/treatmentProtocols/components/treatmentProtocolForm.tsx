import { useEffect, useState, useRef } from "react";
import { CreateTreatmentProtocolRequest, TreatmentProtocolDetail } from "../models";
import { Severity, TreatmentSite } from "../../diseasePathogens/models";
import { usePathogensList } from "../../pathogens/queries";
import { useAntibioticsList } from "../../antibiotics/queries";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Check, X, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from "lucide-react";
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
    specialInfectionId: z.string().nullable().optional(),
    medicineIds: z.array(z.string()).min(1, "Must select at least one medicine!")
});

interface ProtocolFormProps {
    initialData?: TreatmentProtocolDetail | null;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    isPending: boolean;
    error: Error | null;
}

export default function TreatmentProtocolForm({ initialData, onSubmit, onCancel, isPending, error: apiError }: ProtocolFormProps) {
    const isEdit = !!initialData;
    const { data: pathogensList, isLoading: isPathogensLoading } = usePathogensList();
    const { data: antibioticsData, isLoading: isAntibioticsLoading } = useAntibioticsList();

    const [name, setName] = useState("");
    const [issuer, setIssuer] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const [version, setVersion] = useState("1");
    const [severity, setSeverity] = useState<Severity | string>("");
    const [treatmentSite, setTreatmentSite] = useState<TreatmentSite | string>("");
    const [specialInfectionId, setSpecialInfectionId] = useState<string | null>(null);

    const [availableMeds, setAvailableMeds] = useState<{ id: string, name: string }[]>([]);
    const [selectedMeds, setSelectedMeds] = useState<{ id: string, name: string }[]>([]);
    const [leftSearch, setLeftSearch] = useState("");
    const [rightSearch, setRightSearch] = useState("");
    const [selectedLeftIds, setSelectedLeftIds] = useState<Set<string>>(new Set());
    const [selectedRightIds, setSelectedRightIds] = useState<Set<string>>(new Set());

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
            setIssuer(initialData.issuer || "");
            setIssueDate(initialData.issueDate ? new Date(initialData.issueDate).toISOString().split('T')[0] : "");
            setVersion(initialData.version?.toString() || "1");

            const mapSeverity = Object.values(Severity).find(s => s.toLowerCase() === initialData.severity?.toLowerCase()) || "";
            const mapSite = Object.values(TreatmentSite).find(t => t.toLowerCase() === initialData.treatmentSite?.toLowerCase()) || "";
            setSeverity(mapSeverity);
            setTreatmentSite(mapSite);

            const mapPathogenId = pathogensList?.find(p => p.name === initialData.specialInfection?.name)?.id || null;
            setSpecialInfectionId(mapPathogenId);
        } else {
            setName(""); setIssuer(""); setIssueDate(""); setVersion("1"); setSeverity(""); setTreatmentSite(""); setSpecialInfectionId(null);
        }
        setFormErrors({});
    }, [initialData, pathogensList]);

    useEffect(() => {
        if (antibioticsData) {
            const allMeds = antibioticsData.map(a => ({ id: a.id, name: a.name }));

            if (isEdit && initialData?.medicines) {
                const selectedIds = new Set(initialData.medicines.map(m => m.id));
                const rightSide = allMeds.filter(m => selectedIds.has(m.id));
                const leftSide = allMeds.filter(m => !selectedIds.has(m.id));
                setSelectedMeds(rightSide);
                setAvailableMeds(leftSide);
            } else {
                setAvailableMeds(allMeds);
                setSelectedMeds([]);
            }
        }
    }, [antibioticsData, initialData, isEdit]);

    const moveRight = () => {
        const toMove = availableMeds.filter(m => selectedLeftIds.has(m.id));
        setSelectedMeds([...selectedMeds, ...toMove]);
        setAvailableMeds(availableMeds.filter(m => !selectedLeftIds.has(m.id)));
        setSelectedLeftIds(new Set());
        if (formErrors.medicineIds) setFormErrors(p => ({ ...p, medicineIds: "" }));
    };

    const moveLeft = () => {
        const toMove = selectedMeds.filter(m => selectedRightIds.has(m.id));
        setAvailableMeds([...availableMeds, ...toMove]);
        setSelectedMeds(selectedMeds.filter(m => !selectedRightIds.has(m.id)));
        setSelectedRightIds(new Set());
    };

    const moveAllRight = () => {
        setSelectedMeds([...selectedMeds, ...availableMeds]);
        setAvailableMeds([]);
        setSelectedLeftIds(new Set());
        if (formErrors.medicineIds) setFormErrors(p => ({ ...p, medicineIds: "" }));
    };

    const moveAllLeft = () => {
        setAvailableMeds([...availableMeds, ...selectedMeds]);
        setSelectedMeds([]);
        setSelectedRightIds(new Set());
    };

    const toggleSelection = (id: string, side: 'left' | 'right') => {
        const set = side === 'left' ? new Set(selectedLeftIds) : new Set(selectedRightIds);
        if (set.has(id)) set.delete(id); else set.add(id);
        if (side === 'left') setSelectedLeftIds(set); else setSelectedRightIds(set);
    };

    const filteredPathogens = pathogensList?.filter(p => p.name.toLowerCase().includes(pathogenSearch.toLowerCase())) || [];
    const selectedPathogenObj = pathogensList?.find(p => p.id === specialInfectionId);
    const displayPathogenName = selectedPathogenObj ? selectedPathogenObj.name : "None (Select if applicable)...";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const medicineIds = selectedMeds.map(m => m.id);
        const formData = { name, issuer, issueDate, version, severity, treatmentSite, specialInfectionId, medicineIds };
        const result = protocolSchema.safeParse(formData);

        if (!result.success) {
            const errs: Record<string, string> = {};
            result.error.issues.forEach(issue => errs[issue.path[0] as string] = issue.message);
            setFormErrors(errs);
            return;
        }

        setFormErrors({});

        const otherCriteriaIds = isEdit ? (initialData?.otherCriteria?.map(c => c.id) || []) : [];

        onSubmit({
            name,
            issuer,
            issueDate,
            version: parseInt(version),
            severity,
            treatmentSite,
            specialInfectionId,
            otherCriteriaIds,
            medicineIds
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-md shadow-sm border border-gray-200" noValidate>
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-md">
                <h2 className="text-lg font-bold text-gray-700">{isEdit ? "Edit Treatment Protocol" : "Add Treatment Protocol"}</h2>
            </div>

            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Protocol Name <span className="text-red-500">*</span></label>
                        <Input value={name} onChange={(e) => { setName(e.target.value); if (formErrors.name) setFormErrors(p => ({ ...p, name: "" })); }} disabled={isPending} placeholder="e.g. Phác đồ điều trị VPCĐ" className={formErrors.name ? "border-red-500" : ""} />
                        {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Issuer <span className="text-red-500">*</span></label>
                        <Input value={issuer} onChange={(e) => { setIssuer(e.target.value); if (formErrors.issuer) setFormErrors(p => ({ ...p, issuer: "" })); }} disabled={isPending} placeholder="e.g. WHO" className={formErrors.issuer ? "border-red-500" : ""} />
                        {formErrors.issuer && <p className="text-xs text-red-500 mt-1">{formErrors.issuer}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Issue Date <span className="text-red-500">*</span></label>
                        <Input type="date" value={issueDate} onChange={(e) => { setIssueDate(e.target.value); if (formErrors.issueDate) setFormErrors(p => ({ ...p, issueDate: "" })); }} disabled={isPending} className={formErrors.issueDate ? "border-red-500 text-red-500" : ""} />
                        {formErrors.issueDate && <p className="text-xs text-red-500 mt-1">{formErrors.issueDate}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Version <span className="text-red-500">*</span></label>
                        <Input type="number" min="1" value={version} onChange={(e) => { setVersion(e.target.value); if (formErrors.version) setFormErrors(p => ({ ...p, version: "" })); }} disabled={isPending} className={formErrors.version ? "border-red-500" : ""} />
                        {formErrors.version && <p className="text-xs text-red-500 mt-1">{formErrors.version}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Severity <span className="text-red-500">*</span></label>
                        <select value={severity} onChange={(e) => { setSeverity(e.target.value); if (formErrors.severity) setFormErrors(p => ({ ...p, severity: "" })); }} disabled={isPending} className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0c3660] focus:border-[#0c3660] ${formErrors.severity ? "border-red-500" : "border-gray-300"}`}>
                            <option value="" disabled>-- Select --</option>
                            {Object.values(Severity).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {formErrors.severity && <p className="text-xs text-red-500 mt-1">{formErrors.severity}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Treatment Site <span className="text-red-500">*</span></label>
                        <select value={treatmentSite} onChange={(e) => { setTreatmentSite(e.target.value); if (formErrors.treatmentSite) setFormErrors(p => ({ ...p, treatmentSite: "" })); }} disabled={isPending} className={`flex w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#0c3660] focus:border-[#0c3660] ${formErrors.treatmentSite ? "border-red-500" : "border-gray-300"}`}>
                            <option value="" disabled>-- Select --</option>
                            {Object.values(TreatmentSite).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {formErrors.treatmentSite && <p className="text-xs text-red-500 mt-1">{formErrors.treatmentSite}</p>}
                    </div>
                </div>

                <div className="relative" ref={dropdownRef}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Special Infection (Pathogen) <span className="text-zinc-400 font-normal italic">- Optional</span></label>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center justify-between w-full border rounded-md py-2 px-3 text-sm transition bg-white border-gray-300 ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`} onClick={() => { if (!isPending) setIsDropdownOpen(!isDropdownOpen); }}>
                            <span className={specialInfectionId ? "text-gray-900" : "text-gray-400"}>{isPathogensLoading ? "Loading pathogens..." : displayPathogenName}</span>
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
                                <input type="text" value={pathogenSearch} onChange={(e) => setPathogenSearch(e.target.value)} placeholder="Search pathogen..." className="w-full text-sm outline-none bg-transparent" />
                            </div>
                            <ul className="max-h-60 overflow-y-auto p-1">
                                {filteredPathogens.length > 0 ? filteredPathogens.map(p => (
                                    <li key={p.id} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex justify-between items-center" onClick={() => { setSpecialInfectionId(p.id); setIsDropdownOpen(false); setPathogenSearch(""); }}>
                                        {p.name} {specialInfectionId === p.id && <Check className="w-4 h-4 text-[#0c3660]" />}
                                    </li>
                                )) : <li className="px-3 py-2 text-sm text-gray-500 text-center">No pathogens found.</li>}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="border-t pt-4">
                    <label className="block text-xs font-bold text-[#0c3660] mb-2 uppercase tracking-wide">
                        Prescribed Medicines <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">Select the antibiotics to include in this protocol.</p>

                    <div className="flex flex-col md:flex-row gap-4 items-center h-70">
                        <div className="w-full md:w-5/12 h-full flex flex-col border rounded-md overflow-hidden bg-zinc-50">
                            <div className="p-2 border-b bg-white relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search available..." value={leftSearch} onChange={(e) => setLeftSearch(e.target.value)} className="w-full text-xs pl-8 py-1 outline-none" />
                            </div>
                            <div className="flex-1 overflow-y-auto p-1 space-y-1">
                                {isAntibioticsLoading ? <p className="text-xs text-center p-4 text-gray-400">Loading...</p> :
                                    availableMeds.filter(m => m.name.toLowerCase().includes(leftSearch.toLowerCase())).map(med => (
                                        <div
                                            key={med.id}
                                            onClick={() => toggleSelection(med.id, 'left')}
                                            className={`text-sm p-2 rounded cursor-pointer transition-colors ${selectedLeftIds.has(med.id) ? "bg-blue-100 text-[#0c3660] font-medium" : "hover:bg-gray-200 text-gray-700"}`}
                                        >
                                            {med.name}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 justify-center">
                            <Button type="button" variant="outline" size="icon" onClick={moveRight} disabled={selectedLeftIds.size === 0}><ChevronRight className="w-4 h-4" /></Button>
                            <Button type="button" variant="outline" size="icon" onClick={moveLeft} disabled={selectedRightIds.size === 0}><ChevronLeft className="w-4 h-4" /></Button>
                            <Button type="button" variant="outline" size="icon" onClick={moveAllRight} disabled={availableMeds.length === 0}><ChevronsRight className="w-4 h-4" /></Button>
                            <Button type="button" variant="outline" size="icon" onClick={moveAllLeft} disabled={selectedMeds.length === 0}><ChevronsLeft className="w-4 h-4" /></Button>
                        </div>

                        <div className={`w-full md:w-5/12 h-full flex flex-col border rounded-md overflow-hidden bg-blue-50/30 ${formErrors.medicineIds ? "border-red-500" : ""}`}>
                            <div className="p-2 border-b bg-white flex justify-between items-center">
                                <span className="text-xs font-semibold text-[#0c3660]">Selected ({selectedMeds.length})</span>
                            </div>
                            <div className="p-2 border-b bg-white relative">
                                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Search selected..." value={rightSearch} onChange={(e) => setRightSearch(e.target.value)} className="w-full text-xs pl-8 py-1 outline-none" />
                            </div>
                            <div className="flex-1 overflow-y-auto p-1 space-y-1">
                                {selectedMeds.filter(m => m.name.toLowerCase().includes(rightSearch.toLowerCase())).map(med => (
                                    <div
                                        key={med.id}
                                        onClick={() => toggleSelection(med.id, 'right')}
                                        className={`text-sm p-2 rounded cursor-pointer transition-colors ${selectedRightIds.has(med.id) ? "bg-red-100 text-red-700 font-medium" : "bg-white border shadow-sm hover:border-[#0c3660] text-gray-700"}`}
                                    >
                                        {med.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {formErrors.medicineIds && <p className="text-xs text-red-500 mt-2 font-bold">{formErrors.medicineIds}</p>}
                </div>

                {apiError && <p className="text-sm text-red-500 font-bold">{apiError.message}</p>}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50 rounded-b-md">
                <button type="button" onClick={onCancel} disabled={isPending} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-bold text-[#0c3660] bg-white hover:bg-gray-50 transition">
                    Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-6 py-2 rounded-md text-sm font-bold text-white bg-[#0c3660] hover:opacity-90 transition disabled:opacity-50">
                    {isPending ? "Saving..." : "Save Protocol"}
                </button>
            </div>
        </form>
    );
}