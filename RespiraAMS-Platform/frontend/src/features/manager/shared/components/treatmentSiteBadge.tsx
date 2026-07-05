export function TreatmentSiteBadge({ treatmentSite }: { treatmentSite: string }) {
    const t = treatmentSite.toLowerCase();
    let colors = "bg-zinc-100 text-zinc-800";
    let label = treatmentSite;

    if (t === "outpatient") { colors = "bg-green-100 text-green-800"; label = "Outpatient"; }
    else if (t === "inpatient") { colors = "bg-blue-100 text-blue-800"; label = "Inpatient"; }
    else if (t === "intensivecareunit") { colors = "bg-purple-100 text-purple-800"; label = "ICU"; }

    return (
        <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase " + colors}>
            {label}
        </span>
    );
}
