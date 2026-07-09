"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { useHistory, useTreatmentDecision } from "@/features/doctor/history/api"
import { Separator } from "@/components/ui/separator"
import { SeverityBadge } from "@/features/doctor/components/badges"
import { treatmentSiteLabels } from "@/features/doctor/lib/mappers"
import { getUser } from "@/lib/auth"
import { Loader2 } from "lucide-react"

export default function HistoryPage() {
  const user = getUser()
  const doctorId = user?.id ?? ""
  const [page] = useState(1)
  const [selectedId, setSelectedId] = useState("")
  const { data, isLoading } = useHistory(doctorId, { page, size: 100 })
  const { data: detail, isLoading: detailLoading } = useTreatmentDecision(selectedId)

  const items = data?.items ?? []

  return (
    <>
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
                    <TableRow
                      key={item.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedId(item.id)}
                    >
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

      <Sheet open={!!selectedId} onOpenChange={(o) => { if (!o) setSelectedId("") }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{detail ? detail.diseaseName : "Chi tiết ca chẩn đoán"}</SheetTitle>
            {detail && (
              <SheetDescription>
                {new Date(detail.createdAt).toLocaleString("vi-VN")}
              </SheetDescription>
            )}
          </SheetHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : detail ? (
            <div className="px-4 pb-4 space-y-6">
                <section className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Thông tin chung
                  </h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <span className="text-muted-foreground">Bác sĩ</span>
                    <span>{detail.doctorName}</span>
                    <span className="text-muted-foreground">Mức độ</span>
                    <span>
                      <SeverityBadge severity={detail.severity} />
                    </span>
                    <span className="text-muted-foreground">Nơi điều trị</span>
                    <span>{treatmentSiteLabels[detail.treatmentSite] ?? detail.treatmentSite}</span>
                  </div>
                </section>

                <Separator />

                {detail.infectionProbabilities.length > 0 && (
                  <>
                    <section className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Xác suất nhiễm khuẩn
                      </h3>
                      <div className="space-y-2">
                        {detail.infectionProbabilities.map((p, i) => (
                          <div key={i} className="flex items-center justify-between border rounded-lg px-3 py-2">
                            <span className="text-sm">{p.pathogenName}</span>
                            <span className="text-sm font-mono">
                              {(p.infectionProbability * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                    <Separator />
                  </>
                )}

                {detail.criterionItems.length > 0 && (
                  <>
                    <section className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Tiêu chí chẩn đoán
                      </h3>
                      <div className="space-y-2">
                        {detail.criterionItems.map((c, i) => (
                          <div key={i} className="flex items-center justify-between border rounded-lg px-3 py-2">
                            <span className="text-sm">{c.criterionName}</span>
                            <span className="text-sm font-mono">{c.value ?? "—"}</span>
                          </div>
                        ))}
                      </div>
                    </section>
                    <Separator />
                  </>
                )}

                <section className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Phác đồ đề xuất
                  </h3>
                  <div className="border rounded-lg p-3 space-y-1">
                    <p className="text-sm font-medium">{detail.recommended.treatmentProtocolName}</p>
                    <p className="text-xs text-muted-foreground">
                      {detail.recommended.treatmentProtocolIssuer} · v{detail.recommended.treatmentProtocolVersion} ·{" "}
                      {detail.recommended.treatmentProtocolIssueDate}
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Phác đồ đã chọn
                  </h3>
                  <div className="border rounded-lg p-3 space-y-1">
                    <p className="text-sm font-medium">{detail.chosen.treatmentProtocolName}</p>
                    <p className="text-xs text-muted-foreground">
                      {detail.chosen.treatmentProtocolIssuer} · v{detail.chosen.treatmentProtocolVersion} ·{" "}
                      {detail.chosen.treatmentProtocolIssueDate}
                    </p>
                  </div>
                </section>

                {detail.reason && (
                  <>
                    <Separator />
                    <section className="space-y-3">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Lý do chọn phác đồ
                      </h3>
                      <p className="text-sm border rounded-lg p-3">{detail.reason}</p>
                    </section>
                  </>
                )}
              </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">Không tìm thấy thông tin.</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
