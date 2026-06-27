import { ResistanceRisk } from "../../models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { CriterionDisplay } from "../criterionDisplay";

interface Props {
    risks: ResistanceRisk[];
}

export function ResistanceRisksTable({ risks }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Resistance Risks</h2>
                <Button size="sm" className="gap-2" onClick={() => console.log("Stub: Add Resistance Risk")}>
                    <Plus className="w-4 h-4" /> Add Risk
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Pathogen</TableHead>
                            <TableHead className="w-[30%]">Risk Name</TableHead>
                            <TableHead className="w-[30%]">Criterion Detail</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {risks?.length > 0 ? risks.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-red-600 align-top">{item.pathogen}</TableCell>
                                <TableCell className="text-sm align-top">
                                    <div className="whitespace-normal break-words max-w-[200px] md:max-w-[250px] leading-relaxed">
                                        {item.name}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm align-top">
                                    <div className="whitespace-normal break-words max-w-[200px] md:max-w-[250px] leading-relaxed text-zinc-600">
                                        {item.criterion.name}
                                    </div>
                                </TableCell>
                                <TableCell className="align-top"><CriterionDisplay criterion={item.criterion} /></TableCell>
                                <TableCell className="text-right align-top">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => console.log("Stub: Edit", item.id)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => console.log("Stub: Delete", item.id)}><Trash className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-6">No records found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}