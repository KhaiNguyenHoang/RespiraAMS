"use client"

import { useTreatmentProtocolDetail } from "../../treatmentProtocols/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { CriterionDisplay } from "../../diseases/components/criterionDisplay";

interface ProtocolDetailViewProps {
    id: string;
    onBack: () => void;
}

export default function TreatmentProtocolDetailView({ id, onBack }: ProtocolDetailViewProps) {
    const { data: protocol, isLoading, isError } = useTreatmentProtocolDetail(id);

    if (isLoading) return <Skeleton className="w-full h-[80vh] rounded-xl" />;
    if (isError || !protocol) return <ErrorMessage error="Failed to load protocol details" />;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={onBack} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Disease
                </Button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">{protocol.name}</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => console.log("Stub: Edit Protocol Info")} className="gap-2">
                            <Edit className="w-4 h-4" /> Edit
                        </Button>
                        <Button variant="destructive" onClick={() => console.log("Stub: Delete Protocol")} className="gap-2">
                            <Trash className="w-4 h-4" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Version</p>
                        <p className="text-base font-bold text-zinc-900">{protocol.version}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Issuer</p>
                        <p className="text-base font-bold text-zinc-900">{protocol.issuer}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Issue Date</p>
                        <p className="text-base font-bold text-zinc-900">{new Date(protocol.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Special Infection</p>
                        <p className="text-base font-bold text-red-600">
                            {protocol.specialInfection?.name || "None"}
                        </p>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Severity</p>
                        <span className="inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-zinc-200 text-zinc-800 uppercase">
                            {protocol.severity}
                        </span>
                    </div>
                    <div className="bg-zinc-50 p-3 rounded-lg border">
                        <p className="text-xs font-semibold text-zinc-500 uppercase">Treatment Site</p>
                        <span className="inline-flex mt-1 items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                            {protocol.treatmentSite}
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Other Criteria</h2>
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="w-[40%]">Criterion Name</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Type</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {protocol.otherCriteria?.length > 0 ? protocol.otherCriteria.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell><CriterionDisplay criterion={item as any} /></TableCell>
                                    <TableCell>
                                        <span className="capitalize text-zinc-600 text-sm">{item.type}</span>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={3} className="text-center text-zinc-500 py-6">No extra criteria attached.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Medicines (Antibiotics)</h2>
                </div>
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader className="bg-zinc-50">
                            <TableRow>
                                <TableHead className="w-[20%]">Medicine Name</TableHead>
                                <TableHead className="w-[15%]">Category</TableHead>
                                <TableHead className="w-[25%]">Spectrum</TableHead>
                                <TableHead>Dosages</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {protocol.medicines?.length > 0 ? protocol.medicines.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold align-top text-primary">{item.name}</TableCell>
                                    <TableCell className="align-top">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 uppercase border border-blue-200">
                                            {item.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="align-top text-sm text-zinc-600">
                                        <div className="font-semibold text-zinc-800">{item.antibioticSpectrum?.name || "N/A"}</div>
                                        <div className="text-xs mt-1 text-zinc-500 leading-relaxed break-words whitespace-normal" title={item.antibioticSpectrum?.description}>
                                            {item.antibioticSpectrum?.description}
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {item.dosages && Object.keys(item.dosages).length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {Object.entries(item.dosages).map(([route, doses]) => (
                                                    <div key={route} className="text-sm bg-zinc-50 p-2 rounded border border-zinc-100">
                                                        <span className="font-bold capitalize text-zinc-800 block mb-1">
                                                            {route}:
                                                        </span>
                                                        <ul className="list-disc pl-4 text-zinc-600 space-y-1">
                                                            {doses.map((dose, idx) => <li key={idx}>{dose}</li>)}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic text-sm">N/A</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">No medicines prescribed.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
}