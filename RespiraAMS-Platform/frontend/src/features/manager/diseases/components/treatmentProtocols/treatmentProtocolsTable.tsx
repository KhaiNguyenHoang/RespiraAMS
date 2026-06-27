import { TreatmentProtocol } from "../../models";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus, Eye } from "lucide-react";

interface Props {
    protocols: TreatmentProtocol[];
}

export function TreatmentProtocolsTable({ protocols }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Treatment Protocols</h2>
                <Button size="sm" className="gap-2" onClick={() => console.log("Stub: Add Protocol")}>
                    <Plus className="w-4 h-4" /> Add Protocol
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Issuer</TableHead>
                            <TableHead>Version</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {protocols?.length > 0 ? protocols.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-semibold text-primary">{item.name}</TableCell>
                                <TableCell>{item.issuer}</TableCell>
                                <TableCell>v{item.version}</TableCell>
                                <TableCell>{new Date(item.issueDate).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="icon" onClick={() => console.log("Stub: View Protocol", item.id)} title="View Detail"><Eye className="w-4 h-4" /></Button>
                                        <Button variant="outline" size="icon" onClick={() => console.log("Stub: Edit Protocol", item.id)}><Edit className="w-4 h-4" /></Button>
                                        <Button variant="destructive" size="icon" onClick={() => console.log("Stub: Delete Protocol", item.id)}><Trash className="w-4 h-4" /></Button>
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