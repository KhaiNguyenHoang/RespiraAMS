"use client"

import { useEffect, useMemo, useState } from "react";
import { usePathogens } from "../queries";
import { PathogenItem } from "../models";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { NotFoundMessage } from "@/components/custom/notFound";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash } from "lucide-react";
import { useSearchStore } from "../../shared/stores/searchStore";

const PAGE_SIZE = 10;

interface PathogensTableProps {
    onEdit: (item: PathogenItem) => void;
    onDelete: (item: PathogenItem) => void;
}

export function PathogensTable({ onEdit, onDelete }: PathogensTableProps) {
    const [page, setPage] = useState(1);
    const searchName = useSearchStore((s) => s.value);
    const clearSearch = useSearchStore((s) => s.clear);

    useEffect(() => {
        clearSearch();
    }, [clearSearch]);

    useEffect(() => {
        setPage(1);
    }, [searchName]);

    const params = useMemo(() => ({
        page,
        size: PAGE_SIZE,
        name: searchName || undefined
    }), [page, searchName]);

    const { data, isLoading, isError } = usePathogens(params);

    if (isLoading) return <Skeleton className="mx-auto w-[80vw] h-[80vh]" />;
    if (isError) return <ErrorMessage error="Failed to load pathogens list" />;
    if (!data) return <NotFoundMessage />;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pathogen Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium align-middle">
                                <span className="text-primary w-fit shrink-0">
                                    {item.name}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground wrap-break-word whitespace-normal">
                                    {item.description}
                                </span>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" onClick={() => onEdit(item)}>
                                    <Edit />
                                </Button>
                                <Button variant="ghost" onClick={() => onDelete(item)}>
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
