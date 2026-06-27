import { DiseasePathogen } from "../../models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";

interface Props {
    pathogens: DiseasePathogen[];
}

export function DiseasePathogensTable({ pathogens }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Disease Pathogens</h2>
                <Button size="sm" className="gap-2" onClick={() => console.log("Stub: Add Disease Pathogen")}>
                    <Plus className="w-4 h-4" /> Add Pathogen Link
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Pathogen</TableHead>
                            <TableHead>Severity</TableHead>
                            <TableHead>Treatment Site</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pathogens?.length > 0 ? pathogens.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.pathogen}</TableCell>
                                <TableCell>{item.severity}</TableCell>
                                <TableCell>{item.treatmentSite}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => console.log("Stub: Edit", item.id)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => console.log("Stub: Delete", item.id)}><Trash className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">No records found.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}