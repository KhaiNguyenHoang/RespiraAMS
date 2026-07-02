"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useHistory } from "@/features/doctor/history/api"
import { Loader2 } from "lucide-react"

const DOCTOR_ID = "00000000-0000-0000-0000-000000000001"

export default function HistoryPage() {
  const [page] = useState(1)
  const { data, isLoading } = useHistory(DOCTOR_ID, { page, size: 100 })

  const items = data?.items ?? []

  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <header className="mb-8">
        <p className="text-primary text-sm uppercase tracking-widest">Lịch sử</p>
        <h1 className="text-3xl font-bold mt-2">Lịch sử chẩn đoán</h1>
        <p className="text-muted-foreground mt-2">
          Các ca chẩn đoán đã lưu.
        </p>
      </header>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Chưa có ca chẩn đoán nào.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Bệnh lý</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell>{item.diseaseName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
