import { Badge } from "@/components/ui/badge";
import { Criterion } from "../models";

export function CriterionBadge({ criterion }: { criterion: Criterion }) {
    if (criterion.type === "boolean") {
        return (
            <Badge>True / False</Badge>
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
            <Badge>{displayStr}</Badge>
        );
    }

    return <Badge>Unknown type</Badge>;
}