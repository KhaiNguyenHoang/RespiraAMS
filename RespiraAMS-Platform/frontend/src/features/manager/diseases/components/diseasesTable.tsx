"use client"

import { useMemo, useState, useRef } from "react";
import { useDiseases } from "../queries";
import { DiseaseItem } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { NotFoundMessage } from "@/components/custom/notFound";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash, Search, Eye } from "lucide-react";

const PAGE_SIZE = 10;

interface DiseasesTableProps {
    onView: (item: DiseaseItem) => void;
    onEdit: (item: DiseaseItem) => void;
    onDelete: (item: DiseaseItem) => void;
}

export function DiseasesTable({ onView, onEdit, onDelete }: DiseasesTableProps) {
    const [page, setPage] = useState(1);

    const params = useMemo(() => ({ 
        page, 
        size: PAGE_SIZE,
    }), [page]);

    const { data, isLoading, isError } = useDiseases(params);

    if (isLoading) return <Skeleton className="mx-auto w-full h-[60vh]" />;
    if (isError) return <ErrorMessage error="Failed to load diseases list" />;
    
    return (
        <div className="flex flex-col gap-4">

            {!data || !data.items || data.items.length === 0 ? (
                <NotFoundMessage />
            ) : (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">Disease Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[140px] text-right">Actions</TableHead>
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
                                            <Button variant="outline" size="icon" onClick={() => onView(item)} title="View Details">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            {/* <Button variant="outline" size="icon" onClick={() => onEdit(item)} title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </Button> */}
                                            <Button variant="destructive" size="icon" onClick={() => onDelete(item)} title="Delete">
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