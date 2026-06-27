"use client"

import { useEffect, useMemo, useState } from "react";
import { useAntibiotics } from "../queries";
import { useAntibioticSpectraList } from "../../antibiotic_spectra/queries";
import { AntibioticItem, AwareCategory } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { NotFoundMessage } from "@/components/custom/notFound";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash, Search } from "lucide-react";

const PAGE_SIZE = 10;

interface AntibioticsTableProps {
    onEdit: (item: AntibioticItem) => void;
    onDelete: (item: AntibioticItem) => void;
}

export function AntibioticsTable({ onEdit, onDelete }: AntibioticsTableProps) {
    const [page, setPage] = useState(1);
    
    const [searchName, setSearchName] = useState("");
    const [debouncedName, setDebouncedName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<AwareCategory | "">("");
    const [selectedSpectrumId, setSelectedSpectrumId] = useState<string>("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedName(searchName), 500);
        return () => clearTimeout(timer);
    }, [searchName]);

    useEffect(() => {
        setPage(1);
    }, [debouncedName, selectedCategory, selectedSpectrumId]);

    const { data: spectraList } = useAntibioticSpectraList();

    const params = useMemo(() => ({ 
        page, 
        size: PAGE_SIZE,
        name: debouncedName || undefined,
        category: selectedCategory || undefined,
        antibioticSpectrumId: selectedSpectrumId || undefined
    }), [page, debouncedName, selectedCategory, selectedSpectrumId]);

    const { data, isLoading, isError } = useAntibiotics(params);

    if (isLoading) return <Skeleton className="mx-auto w-full h-[60vh]" />;
    if (isError) return <ErrorMessage error="Failed to load antibiotics list" />;
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search antibiotic name..." 
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="pl-9"
                    />
                </div>
                
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value as AwareCategory | "")}
                    className="flex h-10 w-full md:w-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <option value="">All Categories</option>
                    {Object.values(AwareCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select 
                    value={selectedSpectrumId} 
                    onChange={(e) => setSelectedSpectrumId(e.target.value)}
                    className="flex h-10 w-full md:w-[250px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    <option value="">All Spectra</option>
                    {spectraList?.map(spec => (
                        <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                </select>
            </div>

            {!data || !data.items || data.items.length === 0 ? (
                <NotFoundMessage />
            ) : (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Spectrum</TableHead>
                                <TableHead className="w-[300px]">Dosages</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium align-top">{item.name}</TableCell>
                                    <TableCell className="align-top">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 uppercase">
                                            {item.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="align-top text-sm text-muted-foreground">
                                        {item.antibioticSpectrum?.name || "N/A"}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        {item.dosages && Object.keys(item.dosages).length > 0 ? (
                                            <div className="flex flex-col gap-2">
                                                {Object.entries(item.dosages).map(([route, doses]) => (
                                                    <div key={route} className="text-sm">
                                                        <span className="font-semibold capitalize text-zinc-700">
                                                            {route}:
                                                        </span>{" "}
                                                        <span className="text-zinc-600">
                                                            {doses.join(", ")}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic text-sm">N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="align-top text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => onDelete(item)}>
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <div className="border-t p-4 flex justify-end">
                        <Pagination>
                            <PaginationContent>
                                {data.metadata.hasPreviousPage && (
                                    <PaginationItem>
                                        <PaginationPrevious 
                                            onClick={() => setPage((p) => Math.max(1, p - 1))} 
                                            className="cursor-pointer" 
                                        />
                                    </PaginationItem>
                                )}
                                <span className="text-sm text-muted-foreground flex items-center px-4 font-medium">
                                    Page {page} of {data.metadata.pageCount || 1}
                                </span>
                                {data.metadata.hasNextPage && (
                                    <PaginationItem>
                                        <PaginationNext 
                                            onClick={() => setPage((p) => p + 1)} 
                                            className="cursor-pointer" 
                                        />
                                    </PaginationItem>
                                )}
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            )}
        </div>
    );
}