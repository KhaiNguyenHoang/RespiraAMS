"use client"

import { useState } from "react";
import { useCreateAntibiotic, useUpdateAntibiotic, useDeleteAntibiotic } from "../queries";
import { AntibioticItem } from "../models";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { AntibioticsTable } from "./antibioticsTable";
import AntibioticForm from "./antibioticForm";
import DeleteAntibioticPanel from "./deleteAntibioticPanel";

type SheetView = "create" | "update" | "delete" | null;

export function AntibioticsPage() {
    const [sheetView, setSheetView] = useState<SheetView>(null);
    const [selectedAntibiotic, setSelectedAntibiotic] = useState<AntibioticItem | null>(null);

    const createMutation = useCreateAntibiotic();
    const updateMutation = useUpdateAntibiotic();
    const deleteMutation = useDeleteAntibiotic();

    const openSheet = (view: SheetView, item?: AntibioticItem) => {
        setSelectedAntibiotic(item ?? null);
        setSheetView(view);
    };

    const closeSheet = () => {
        setSheetView(null);
        setSelectedAntibiotic(null);
    };

    const isSheetOpen = sheetView !== null;

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Antibiotics</h1>
                <Button onClick={() => openSheet("create")}>
                    <Plus className="mr-2" /> Create
                </Button>
            </div>

            <AntibioticsTable
                onEdit={(item) => openSheet("update", item)}
                onDelete={(item) => openSheet("delete", item)}
            />

            <Sheet open={isSheetOpen} onOpenChange={(open) => { if (!open) closeSheet(); }}>
                <SheetContent side="right" className="overflow-y-auto w-[400px] sm:w-[540px]">
    <SheetHeader>
        <SheetTitle>
            {sheetView === "create" && "Thêm Kháng Sinh Mới"}
            {sheetView === "update" && "Cập Nhật Kháng Sinh"}
            {sheetView === "delete" && "Xóa Kháng Sinh"}
        </SheetTitle>
        <SheetDescription>
            {sheetView === "create" && "Điền thông tin bên dưới để tạo."}
            {sheetView === "update" && "Sửa thông tin kháng sinh."}
            {sheetView === "delete" && "Xác nhận xóa kháng sinh này."}
        </SheetDescription>
    </SheetHeader>

    <div className="p-4 mt-4">
        {(sheetView === "create" || (sheetView === "update" && selectedAntibiotic)) && (
            <AntibioticForm
                initialData={sheetView === "update" ? selectedAntibiotic : null}
                onSubmit={(data) => {
                    if (sheetView === "create") {
                        createMutation.mutate(data, { onSuccess: closeSheet });
                    } else if (sheetView === "update" && selectedAntibiotic) {
                        updateMutation.mutate({ id: selectedAntibiotic.id, ...data }, { onSuccess: closeSheet });
                    }
                }}
                onCancel={closeSheet}
                isPending={createMutation.isPending || updateMutation.isPending}
                error={createMutation.error || updateMutation.error}
            />
        )}

        {sheetView === "delete" && selectedAntibiotic && (
            <DeleteAntibioticPanel
                antibiotic={selectedAntibiotic}
                onConfirm={() => deleteMutation.mutate(selectedAntibiotic.id, { onSuccess: closeSheet })}
                onCancel={closeSheet}
                isPending={deleteMutation.isPending}
                error={deleteMutation.error}
            />
        )}
    </div>
</SheetContent>
            </Sheet>
        </>
    );
}