"use client"

import { useState } from "react";
import { useDoctors } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Trash } from "lucide-react";
import { DoctorItem } from "../models";

interface DoctorsTableProps {
    onEdit: (doctor: DoctorItem) => void;
    onDelete: (doctor: DoctorItem) => void;
}

const PAGE_SIZE = 10;

export function DoctorsTable({ onEdit, onDelete }: DoctorsTableProps) {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useDoctors(page, PAGE_SIZE);

    if (isLoading) return <Skeleton className="mx-auto w-[80vw] h-[80vh]" />;
    if (isError || !data) return <ErrorMessage error="Failed to load doctors list" />;

    const getInitials = (first: string, last: string) => {
        return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Doctor Profile</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Position / Title</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.items.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium align-middle">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border">
                                        {doc.mediaUrl ? (
                                            <img src={doc.mediaUrl} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-sm">{getInitials(doc.firstName, doc.lastName)}</span>
                                        )}
                                    </div>
                                    <span className="text-primary w-fit shrink-0">
                                        {doc.firstName} {doc.lastName}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground w-fit shrink-0">
                                    <div>{doc.email}</div>
                                    <div className="mt-0.5">{doc.phoneNumber}</div>
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground w-fit shrink-0">
                                    <div className="text-sm font-medium text-zinc-800">{doc.position || "N/A"}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{doc.academicTitle || "No title"}</div>
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${doc.gender ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                    {doc.gender ? "Male" : "Female"}
                                </span>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" onClick={() => onDelete(doc)}>
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
                            className={data.metadata.hasPrevious ? "" : "pointer-events-none opacity-50"}
                            onClick={() => setPage((p) => p - 1)}
                        />
                    </PaginationItem>

                    <span className="text-sm text-muted-foreground">
                        Page {data.metadata.pageIndex} of {data.metadata.totalPages || 1}
                    </span>

                    <PaginationItem>
                        <PaginationNext
                            className={data.metadata.hasNext ? "" : "pointer-events-none opacity-50"}
                            onClick={() => setPage((p) => p + 1)}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </>
    );
}
