"use client"

import { useMemo, useState } from "react";
import { useAntibioticSpectra } from "../queries";
import { AntibioticSpectrumItem } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { NotFoundMessage } from "@/components/custom/notFound";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash } from "lucide-react";

const PAGE_SIZE = 10;

interface AntibioticSpectraTableProps {
    onEdit: (spectrum: AntibioticSpectrumItem) => void;
    onDelete: (spectrum: AntibioticSpectrumItem) => void;
}

export function AntibioticSpectraTable({ onEdit, onDelete }: AntibioticSpectraTableProps) {
    const [page, setPage] = useState(1);
    const params = useMemo(() => ({ page, size: PAGE_SIZE }), [page]);
    const { data, isLoading, isError } = useAntibioticSpectra(params);

    if (isLoading) return <Skeleton className="mx-auto w-[80vw] h-[80vh]" />;
    if (isError) return <ErrorMessage error="Failed to load antibiotic spectrum list" />;
    if (!data) return <NotFoundMessage />;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.items.map((spectrum) => (
                        <TableRow key={spectrum.id}>
                            <TableCell className="font-medium align-middle">
                                <span className="text-primary w-fit shrink-0">
                                    {spectrum.name}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground wrap-break-word whitespace-normal">
                                    {spectrum.description}
                                </span>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" onClick={() => onEdit(spectrum)}>
                                    <Edit />
                                </Button>
                                <Button variant="ghost" onClick={() => onDelete(spectrum)}>
                                    <Trash className="text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className={data.metadata.hasPreviousPage ? "" : "pointer-events-none opacity-50"}
                            onClick={() => setPage((p) => p - 1)}
                        />
                    </PaginationItem>

                    <span className="text-sm text-muted-foreground">
                        Page {page} of {data.metadata.pageCount}
                    </span>

                    <PaginationItem>
                        <PaginationNext
                            className={data.metadata.hasNextPage ? "" : "pointer-events-none opacity-50"}
                            onClick={() => setPage((p) => p + 1)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
