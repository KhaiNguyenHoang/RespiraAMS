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
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Edit, Trash, ListFilter } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchStore } from "../../shared/stores/searchStore";

const PAGE_SIZE = 10;

interface AntibioticsTableProps {
    onEdit: (item: AntibioticItem) => void;
    onDelete: (item: AntibioticItem) => void;
}

function Category({ category }: { category: string }) {
    let colors = "bg-blue-100 text-blue-800";
    let displayName = "";

    switch (category.toLowerCase()) {
        case AwareCategory.Access.toLowerCase():
            colors = "bg-blue-100 text-blue-800";
            displayName = "Access";
            break;
        case AwareCategory.Watch.toLowerCase():
            colors = "bg-amber-100 text-amber-800";
            displayName = "Watch";
            break;
        case AwareCategory.Reserve.toLowerCase():
            colors = "bg-red-100 text-red-800";
            displayName = "Reserve";
            break;
        case AwareCategory.AccessWatch.toLowerCase():
            colors = "bg-purple-100 text-purple-800";
            displayName = "Access-Watch";
            break;
        case AwareCategory.Others.toLowerCase():
            colors = "bg-green-100 text-green-800";
            displayName = "Others";
            break;
        case AwareCategory.Unclassified.toLowerCase():
            colors = "bg-gray-100 text-gray-800";
            displayName = "Unclassified";
            break;
    }

    return (
        <span className={"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase " + colors}>
            {displayName}
        </span>
    )
}

export function AntibioticsTable({ onEdit, onDelete }: AntibioticsTableProps) {
    const [page, setPage] = useState(1);

    const [selectedCategory, setSelectedCategory] = useState<AwareCategory | "">("");
    const [selectedSpectrumId, setSelectedSpectrumId] = useState<string>("");

    const searchName = useSearchStore((s) => s.value);
    const clearSearch = useSearchStore((s) => s.clear);

    useEffect(() => {
        clearSearch();
    }, [clearSearch]);

    useEffect(() => {
        setPage(1);
    }, [searchName, selectedCategory, selectedSpectrumId]);

    const { data: spectraList } = useAntibioticSpectraList();

    const params = useMemo(() => ({
        page,
        size: PAGE_SIZE,
        name: searchName || undefined,
        category: selectedCategory || undefined,
        antibioticSpectrumId: selectedSpectrumId || undefined
    }), [page, searchName, selectedCategory, selectedSpectrumId]);

    const { data, isLoading, isError } = useAntibiotics(params);

    if (isLoading) return <Skeleton className="mx-auto w-[80vw] h-[80vh]" />;
    if (isError) return <ErrorMessage error="Failed to load antibiotics list" />;
    if (!data) return <NotFoundMessage />;

    const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedSpectrumId ? 1 : 0);

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Spectrum</TableHead>
                        <TableHead>Dosages</TableHead>
                        <TableHead className="overflow-visible py-3">
                            <div className="flex items-center justify-end gap-2">
                                Actions
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="relative">
                                            <ListFilter className="h-4 w-4" />
                                            {activeFilterCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                                    {activeFilterCount}
                                                </span>
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                                        <DropdownMenuSeparator />

                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                AWaRe Category
                                                {selectedCategory && (
                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                        {selectedCategory}
                                                    </span>
                                                )}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem
                                                    onSelect={(e) => e.preventDefault()}
                                                    onClick={() => setSelectedCategory("")}
                                                >
                                                    All Categories
                                                </DropdownMenuItem>
                                                {Object.values(AwareCategory).map((cat) => (
                                                    <DropdownMenuItem
                                                        key={cat}
                                                        onSelect={(e) => e.preventDefault()}
                                                        onClick={() => setSelectedCategory(cat)}
                                                    >
                                                        {cat === "AccessWatch" ? "Access-Watch" : cat}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>

                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                Spectrum
                                                {selectedSpectrumId && (
                                                    <span className="ml-auto text-xs text-muted-foreground">
                                                        {spectraList?.find(s => s.id === selectedSpectrumId)?.name}
                                                    </span>
                                                )}
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem
                                                    onSelect={(e) => e.preventDefault()}
                                                    onClick={() => setSelectedSpectrumId("")}
                                                >
                                                    All Spectra
                                                </DropdownMenuItem>
                                                {spectraList?.map((spec) => (
                                                    <DropdownMenuItem
                                                        key={spec.id}
                                                        onSelect={(e) => e.preventDefault()}
                                                        onClick={() => setSelectedSpectrumId(spec.id)}
                                                    >
                                                        {spec.name}
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>

                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={(e) => e.preventDefault()}
                                            onClick={() => {
                                                setSelectedSpectrumId("");
                                                setSelectedCategory("");
                                            }}
                                        >
                                            Clear all filter
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TableHead>
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
                                <Category category={item.category} />
                            </TableCell>
                            <TableCell className="align-middle">
                                <span className="text-foreground w-fit shrink-0">
                                    {item.antibioticSpectrum?.name || "N/A"}
                                </span>
                            </TableCell>
                            <TableCell className="align-middle">
                                {item.dosages && Object.keys(item.dosages).length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {Object.entries(item.dosages).map(([route, doses]) => (
                                            <div key={route} className="text-sm wrap-break-word whitespace-normal">
                                                <span className="font-semibold capitalize text-foreground">
                                                    {route}:
                                                </span>{" "}
                                                <span className="text-foreground">
                                                    {doses.join(", ")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground italic text-sm">N/A</span>
                                )}
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
