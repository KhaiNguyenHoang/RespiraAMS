"use client"

import { useMemo, useState, useRef } from "react";
import { usePathogens } from "../queries";
import { PathogenItem } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { NotFoundMessage } from "@/components/custom/notFound";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash, Search } from "lucide-react";

const PAGE_SIZE = 10;

interface PathogensTableProps {
    onEdit: (item: PathogenItem) => void;
    onDelete: (item: PathogenItem) => void;
}

export function PathogensTable({ onEdit, onDelete }: PathogensTableProps) {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        
        debounceTimer.current = setTimeout(() => {
            setSearchTerm(value);
            setPage(1);
        }, 500);
    };

    const params = useMemo(() => ({ 
        page, 
        size: PAGE_SIZE,
        name: searchTerm || undefined
    }), [page, searchTerm]);

    const { data, isLoading, isError } = usePathogens(params);

    if (isLoading) return <Skeleton className="mx-auto w-full h-[60vh]" />;
    if (isError) return <ErrorMessage error="Failed to load pathogens list" />;
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        defaultValue={searchTerm} 
                        onChange={handleSearchChange}
                        placeholder="Search pathogen name..." 
                        className="pl-9"
                    />
                </div>
            </div>

            {!data || !data.items || data.items.length === 0 ? (
                <NotFoundMessage />
            ) : (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Pathogen Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-semibold align-top text-primary">
                                        {item.name}
                                    </TableCell>
                                    <TableCell className="align-top">
                                        <div className="text-sm text-zinc-600 leading-relaxed whitespace-normal break-words max-w-[200px] sm:max-w-sm md:max-w-md lg:max-w-xl">
                                            {item.description}
                                        </div>
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
                                        <PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} className="cursor-pointer" />
                                    </PaginationItem>
                                )}
                                <span className="text-sm text-muted-foreground flex items-center px-4 font-medium">
                                    Page {page} of {data.metadata.pageCount || 1}
                                </span>
                                {data.metadata.hasNextPage && (
                                    <PaginationItem>
                                        <PaginationNext onClick={() => setPage((p) => p + 1)} className="cursor-pointer" />
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