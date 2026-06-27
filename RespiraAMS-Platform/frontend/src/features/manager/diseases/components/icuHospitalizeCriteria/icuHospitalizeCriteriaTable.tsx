import { IcuHospitalizeCriterion } from "../../models"; // Nhớ trỏ đúng đường dẫn models
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { CriterionDisplay } from "../criterionDisplay";

interface Props {
    criteria: IcuHospitalizeCriterion[];
}

export function IcuHospitalizeCriteriaTable({ criteria }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">ICU Hospitalization Criteria</h2>
                <Button size="sm" className="gap-2" onClick={() => console.log("Stub: Add ICU")}>
                    <Plus className="w-4 h-4" /> Add ICU Criterion
                </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead>Criterion Name</TableHead>
                            <TableHead>Condition</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {criteria?.length > 0 ? criteria.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.criterion.name}</TableCell>
                                <TableCell><CriterionDisplay criterion={item.criterion} /></TableCell>
                                <TableCell>
                                    {item.isMainCriteria ? (
                                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Main</span>
                                    ) : (
                                        <span className="bg-zinc-100 text-zinc-700 px-2 py-1 rounded text-xs font-semibold">Secondary</span>
                                    )}
                                </TableCell>
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