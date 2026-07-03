// File: src/features/manager/doctors/components/doctorsTable.tsx
"use client"

import { useState } from "react";
import { useDoctors } from "../queries";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorMessage } from "@/components/custom/error";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash, User } from "lucide-react";
import { DoctorItem } from "../models";

interface DoctorsTableProps {
    onEdit: (doctor: DoctorItem) => void;
    onDelete: (doctor: DoctorItem) => void;
}

const PAGE_SIZE = 10;

export function DoctorsTable({ onEdit, onDelete }: DoctorsTableProps) {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useDoctors(page, PAGE_SIZE);

    if (isLoading) return <Skeleton className="w-full h-[60vh] rounded-xl" />;
    if (isError || !data) return <ErrorMessage error="Failed to load doctors list" />;

    const getInitials = (first: string, last: string) => {
        return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50">
                        <TableRow>
                            <TableHead className="w-[300px]">Doctor Profile</TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>Position / Title</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.items.length > 0 ? data.items.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell className="align-middle">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden border">
                                            {doc.mediaUrl ? (
                                                <img src={doc.mediaUrl} alt="Avatar" className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-sm">{getInitials(doc.firstName, doc.lastName)}</span>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-zinc-900">
                                                {doc.firstName} {doc.lastName}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="align-middle text-sm text-zinc-600">
                                    <div>{doc.email}</div>
                                    <div className="mt-0.5">{doc.phoneNumber}</div>
                                </TableCell>
                                <TableCell className="align-middle">
                                    <div className="text-sm font-medium text-zinc-800">{doc.position || "N/A"}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{doc.academicTitle || "No title"}</div>
                                </TableCell>
                                <TableCell className="align-middle">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${doc.gender ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                        {doc.gender ? "Male" : "Female"}
                                    </span>
                                </TableCell>
                                <TableCell className="align-middle text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="destructive" size="icon" onClick={() => onDelete(doc)}>
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-zinc-500 py-10">
                                    No doctors found in the system.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="border-t p-4 flex justify-end">
                    <Pagination>
                        <PaginationContent>
                            {data.metadata.hasPrevious && (
                                <PaginationItem>
                                    <PaginationPrevious 
                                        onClick={() => setPage((p) => Math.max(1, p - 1))} 
                                        className="cursor-pointer" 
                                    />
                                </PaginationItem>
                            )}
                            <span className="text-sm text-muted-foreground flex items-center px-4 font-medium">
                                Page {data.metadata.pageIndex} of {data.metadata.totalPages || 1}
                            </span>
                            {data.metadata.hasNext && (
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
        </div>
    );
}