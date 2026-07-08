export function SeverityBadge({ severity }: { severity: string }) {
    const s = severity.toLowerCase();
    let colors = "bg-zinc-100 text-zinc-800";

    if (s === "mild") colors = "bg-green-100 text-green-800";
    else if (s === "moderate") colors = "bg-amber-100 text-amber-800";
    else if (s === "severe") colors = "bg-red-100 text-red-800";

    return (
        <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase " + colors}>
            {severity}
        </span>
    );
}
