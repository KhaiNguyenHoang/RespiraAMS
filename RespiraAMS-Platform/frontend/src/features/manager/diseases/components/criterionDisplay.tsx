import { Criterion } from "../models";

export function CriterionDisplay({ criterion }: { criterion: Criterion }) {
    if (criterion.type === "boolean") {
        return (
            <span className="font-mono text-xs font-semibold bg-zinc-100 text-zinc-700 px-2 py-1 rounded border">
                True / False
            </span>
        );
    }

    if (criterion.type === "numeric") {
        const isMinInf = criterion.min === null;
        const isMaxInf = criterion.max === null || criterion.max > 1e300;
        const unitStr = criterion.unit ? ` ${criterion.unit}` : "";
        
        let displayStr = "";
        
        if (isMinInf && !isMaxInf) {
            const op = criterion.isExclusive ? "<" : "<=";
            displayStr = `${op} ${criterion.max}${unitStr}`;
        } else if (!isMinInf && isMaxInf) {
            const op = criterion.isExclusive ? ">" : ">=";
            displayStr = `${op} ${criterion.min}${unitStr}`;
        } else if (!isMinInf && !isMaxInf) {
            const op = criterion.isExclusive ? "<" : "<=";
            displayStr = `${criterion.min} ${op} x ${op} ${criterion.max}${unitStr}`;
        } else {
            displayStr = `Any${unitStr}`;
        }

        return (
            <span className="font-mono text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                {displayStr}
            </span>
        );
    }

    return <span className="text-zinc-500 italic">Unknown Type</span>;
}