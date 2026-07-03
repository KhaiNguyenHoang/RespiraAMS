import { Input } from "@/components/ui/input";

export interface CriterionFormState {
    name: string;
    type: "Boolean" | "Numeric";
    min: string;
    max: string;
    unit: string;
    isExclusive: boolean;
}

interface CriterionFormFieldsProps {
    value: CriterionFormState;
    onChange: (val: CriterionFormState) => void;
    errors?: Record<string, string>;
    disabled?: boolean;
    isEditMode?: boolean;
}

export function CriterionFormFields({ value, onChange, errors = {}, disabled, isEditMode }: CriterionFormFieldsProps) {
    const set = (k: keyof CriterionFormState, v: any) => onChange({ ...value, [k]: v });

    return (
        <div className="space-y-5">
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Criterion Name <span className="text-red-500">*</span></label>
                <Input 
                    value={value.name} 
                    onChange={(e) => set("name", e.target.value)} 
                    disabled={disabled}
                    placeholder="e.g. Systolic Blood Pressure"
                    className={`block w-full border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0c3660] focus:border-[#0c3660] ${errors["criterion.name"] ? "border-red-500" : ""}`}
                />
                {errors["criterion.name"] && <p className="text-xs text-red-500 mt-1">{errors["criterion.name"]}</p>}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Criterion Type</label>
                <div className={`flex bg-gray-100 p-1 rounded-md border border-gray-200 ${disabled || isEditMode ? "opacity-60 pointer-events-none" : ""}`}>
                    <button 
                        type="button"
                        onClick={() => set("type", "Boolean")} 
                        className={`flex-1 py-1.5 text-sm transition-all rounded shadow-sm ${value.type === "Boolean" ? "font-bold text-[#0c3660] bg-white" : "font-semibold text-gray-500 hover:text-gray-700 bg-transparent shadow-none"}`}
                    >
                        Boolean
                    </button>
                    <button 
                        type="button"
                        onClick={() => set("type", "Numeric")} 
                        className={`flex-1 py-1.5 text-sm transition-all rounded shadow-sm ${value.type === "Numeric" ? "font-bold text-[#0c3660] bg-white" : "font-semibold text-gray-500 hover:text-gray-700 bg-transparent shadow-none"}`}
                    >
                        Numeric
                    </button>
                </div>
            </div>

            {value.type === "Numeric" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Min</label>
                        <Input 
                            type="number"
                            value={value.min} 
                            onChange={(e) => set("min", e.target.value)} 
                            disabled={disabled}
                            // placeholder="-∞"
                            required
                            className={`block w-full border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700 ${errors["criterion.min"] ? "border-red-500" : ""}`}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Max</label>
                        <Input 
                            type="number"
                            value={value.max} 
                            onChange={(e) => set("max", e.target.value)} 
                            disabled={disabled}
                            // placeholder="+∞"
                            required
                            className={`block w-full border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700 ${errors["criterion.max"] ? "border-red-500" : ""}`}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Unit</label>
                        <Input 
                            value={value.unit} 
                            onChange={(e) => set("unit", e.target.value)} 
                            disabled={disabled}
                            placeholder="e.g. mmHg"
                            required
                            className="block w-full border-gray-300 rounded-md py-2 px-3 text-sm text-gray-700"
                        />
                    </div>

                    <div className="col-span-1 sm:col-span-3">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={value.isExclusive} 
                                onChange={(e) => set("isExclusive", e.target.checked)}
                                disabled={disabled}
                                className="rounded border-gray-300 text-[#0c3660] focus:ring-[#0c3660]" 
                            />
                            <span className="text-xs font-semibold text-gray-600">Exclusive bounds ( use &lt; instead of &le; )</span>
                        </label>
                        {errors["criterion.max"] && <p className="text-xs text-red-500 mt-1">{errors["criterion.max"]}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}