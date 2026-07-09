"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Search, Bug, Stethoscope, Pill, FileText, ArrowRight, Eye } from "lucide-react"
import { useAntibiotics, usePathogens, useDiseases, useDiseaseDetailWithProtocols, useTreatmentProtocolDetail } from "@/features/doctor/info/api"
import { AntibioticItem, PathogenItem, DiseaseItem, TreatmentProtocolItem } from "@/features/doctor/info/types"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { SeverityBadge, AwareBadge } from "@/features/doctor/components/badges"

function AntibioticsTab() {
  const { data, isLoading } = useAntibiotics({ page: 1, size: 100 })
  const [search, setSearch] = useState("")

  const items = data?.items ?? []
  const filtered = items.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.antibioticSpectrum.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm thuốc..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Không có dữ liệu</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item: AntibioticItem) => (
            <Card key={item.id} className="group overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 rounded-xl">
              {/* Header với background nhẹ hoặc thanh điểm khuyết */}
              <CardHeader className="border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="flex items-center gap-2.5 text-base font-semibold text-slate-800">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Pill className="h-4 w-4 shrink-0" />
                  </div>
                  <span className="line-clamp-1">{item.name}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 pb-2">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Phổ kháng khuẩn</p>
                    <p className="text-sm font-semibold text-slate-700">{item.antibioticSpectrum.name}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Phân loại</p>
                    <div className="inline-block">
                      <AwareBadge category={item.category} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Liều dùng chi tiết ({item.routeOfAdministrations.join(", ")})
                  </p>

                  <div className="grid gap-2.5">
                    {item.routeOfAdministrations.map((route) => (
                      <div key={route} className="bg-muted/40 rounded-lg p-3 border border-slate-100 hover:bg-muted/70 transition-colors">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white text-slate-600 border border-slate-200 uppercase tracking-wide mb-2">
                          {route}
                        </span>
                        <ul className="space-y-1.5 core-elements">
                          {item.dosages[route]?.map((d, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <span className="text-primary/60 mt-1.5 text-[8px]">•</span>
                              <span className="leading-relaxed">{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function PathogensTab() {
  const { data, isLoading } = usePathogens({ page: 1, size: 100 })
  const [search, setSearch] = useState("")

  const items = data?.items ?? []
  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm tác nhân..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Không có dữ liệu</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item: PathogenItem) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-primary shrink-0" />
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function DiseasesTab({
  onViewProtocols,
  onViewDetail,
}: {
  onViewProtocols: (diseaseId: string) => void
  onViewDetail: (diseaseId: string) => void
}) {
  const { data, isLoading } = useDiseases({ page: 1, size: 100 })
  const [search, setSearch] = useState("")

  const filtered = (data?.items ?? []).filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.description ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm bệnh..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Không có dữ liệu</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item: DiseaseItem) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onViewDetail(item.id)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewProtocols(item.id)
                  }}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Xem phác đồ
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProtocolsTab({
  selectedDiseaseId,
  onDiseaseChange,
  diseases,
  isLoadingDiseases,
}: {
  selectedDiseaseId: string | undefined
  onDiseaseChange: (id: string) => void
  diseases: DiseaseItem[]
  isLoadingDiseases: boolean
}) {
  const { data: diseaseDetail, isLoading } = useDiseaseDetailWithProtocols(selectedDiseaseId)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | undefined>()
  const { data: protocolDetail, isLoading: isLoadingDetail } = useTreatmentProtocolDetail(
    sheetOpen ? selectedProtocolId : undefined
  )

  const protocols = diseaseDetail?.treatmentProtocols ?? []

  const handleViewDetail = (id: string) => {
    setSelectedProtocolId(id)
    setSheetOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">Chọn bệnh lý</p>
        {isLoadingDiseases ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <Select value={selectedDiseaseId ?? ""} onValueChange={onDiseaseChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn bệnh lý để xem phác đồ..." />
            </SelectTrigger>
            <SelectContent position="popper">
              {diseases.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {!selectedDiseaseId ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Vui lòng chọn bệnh lý để xem phác đồ điều trị
        </div>
      ) : isLoading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Đang tải...</div>
      ) : protocols.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Không có phác đồ nào cho bệnh lý này
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {protocols.map((item: TreatmentProtocolItem) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="rounded bg-muted px-2 py-0.5 font-medium">v{item.version}</span>
                  <span>{item.issuer}</span>
                  <span>{item.issueDate}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 w-full"
                  onClick={() => handleViewDetail(item.id)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Xem chi tiết phác đồ
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto pb-4">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary shrink-0" />
              {protocolDetail ? protocolDetail.name : "Chi tiết phác đồ"}
            </SheetTitle>
            <SheetDescription>
              {/* {protocolDetail ? `v${protocolDetail.version} - ${protocolDetail.issuer}` : ""} */}
            </SheetDescription>
          </SheetHeader>

          {isLoadingDetail ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Đang tải...</div>
          ) : protocolDetail ? (
            <div className="px-4 space-y-5">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">Phiên bản</p>
                <span className="rounded bg-muted px-2 py-0.5 font-medium">v{protocolDetail.version}</span>
                <span>{protocolDetail.issuer}</span>
                <span>{protocolDetail.issueDate}</span>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">Mức độ</p>
                  <SeverityBadge severity={protocolDetail.severity} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">Điều trị tại</p>
                  <p className="text-sm font-medium">{protocolDetail.treatmentSite === "IntensiveCareUnit" ? "ICU" : protocolDetail.treatmentSite === "Outpatient" ? "Ngoại trú" : "Nội trú"}</p>
                </div>
              </div>

              {protocolDetail.specialInfection && (
                <div>
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-0.5">Nhiễm trùng đặc biệt</p>
                  <p className="text-sm font-medium">{protocolDetail.specialInfection.name}</p>
                  {protocolDetail.specialInfection.description && (
                    <p className="text-xs text-foreground">{protocolDetail.specialInfection.description}</p>
                  )}
                </div>
              )}

              {protocolDetail.otherCriteria.length > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">Tiêu chí khác</p>
                  <ul className="space-y-1.5">
                    {protocolDetail.otherCriteria.map((c) => (
                      <li key={c.id} className="text-sm">
                        <span className="font-medium">{c.name}</span>
                        {c.unit && (
                          <span className="text-muted-foreground ml-1">({c.unit})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
                  Thuốc trong phác đồ ({protocolDetail.medicines.length})
                </p>
                <div className="space-y-2">
                  {(protocolDetail.medicines ?? []).map((m) => (
                    <div key={m.id} className="rounded-lg border p-3">
                      <p className="text-sm font-medium">{m.name}</p>
                      <div className="mt-1 text-xs space-y-0.5">
                        <p>Phổ: {m.antibioticSpectrum?.name}</p>
                        <p className="capitalize">Phân loại: <AwareBadge category={m.category} /></p>
                        <p>Đường dùng: {(m.routeOfAdministrations ?? []).join(", ")}</p>
                      </div>
                      {(m.routeOfAdministrations ?? []).map((route) => (
                        <div key={route} className="mt-1">
                          <p className="text-xs font-medium uppercase text-primary">{route}</p>
                          <ul className="list-disc pl-4 text-xs">
                            {(m.dosages?.[route] ?? []).map((d, i) => <li key={i}>{d}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Không tìm thấy phác đồ</div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function InfoPage() {
  const [tab, setTab] = useState("antibiotics")
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | undefined>()
  const [diseaseSheetOpen, setDiseaseSheetOpen] = useState(false)
  const [diseaseSheetId, setDiseaseSheetId] = useState<string | undefined>()
  const { data: diseasesData, isLoading: isLoadingDiseases } = useDiseases({ page: 1, size: 100 })
  const { data: diseaseSheetDetail, isLoading: isLoadingDiseaseDetail } = useDiseaseDetailWithProtocols(
    diseaseSheetOpen ? diseaseSheetId : undefined
  )

  const handleViewProtocols = (diseaseId: string) => {
    setSelectedDiseaseId(diseaseId)
    setTab("protocols")
  }

  const handleViewDiseaseDetail = (diseaseId: string) => {
    setDiseaseSheetId(diseaseId)
    setDiseaseSheetOpen(true)
  }

  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <header className="mb-8">
        <p className="text-primary text-sm uppercase tracking-widest">Tra cứu</p>
        <h1 className="text-3xl font-bold mt-2">Thông tin tham khảo</h1>
        <p className="text-muted-foreground mt-2">
          Tra cứu thông tin về thuốc, tác nhân gây bệnh, bệnh lý và phác đồ điều trị.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="antibiotics">Thuốc kháng sinh</TabsTrigger>
          <TabsTrigger value="pathogens">Tác nhân gây bệnh</TabsTrigger>
          <TabsTrigger value="diseases">Bệnh lý</TabsTrigger>
          <TabsTrigger value="protocols">Phác đồ điều trị</TabsTrigger>
        </TabsList>
        <TabsContent value="antibiotics" className="mt-6">
          <AntibioticsTab />
        </TabsContent>
        <TabsContent value="pathogens" className="mt-6">
          <PathogensTab />
        </TabsContent>
        <TabsContent value="diseases" className="mt-6">
          <DiseasesTab
            onViewProtocols={handleViewProtocols}
            onViewDetail={handleViewDiseaseDetail}
          />
        </TabsContent>
        <TabsContent value="protocols" className="mt-6">
          <ProtocolsTab
            selectedDiseaseId={selectedDiseaseId}
            onDiseaseChange={setSelectedDiseaseId}
            diseases={diseasesData?.items ?? []}
            isLoadingDiseases={isLoadingDiseases}
          />
        </TabsContent>
      </Tabs>

      <Sheet open={diseaseSheetOpen} onOpenChange={setDiseaseSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary shrink-0" />
              {diseaseSheetDetail ? diseaseSheetDetail.name : "Chi tiết bệnh lý"}
            </SheetTitle>
            <SheetDescription>
            </SheetDescription>
          </SheetHeader>

          {isLoadingDiseaseDetail ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Đang tải...</div>
          ) : diseaseSheetDetail ? (
            <div className="px-4 space-y-4">
              <p className="text-sm text-foreground">{diseaseSheetDetail.description}</p>

              {diseaseSheetDetail.treatmentProtocols.length > 0 && (
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-primary uppercase tracking-wide mb-2">
                    Phác đồ điều trị ({diseaseSheetDetail.treatmentProtocols.length})
                  </p>
                  <ul className="space-y-2">
                    {diseaseSheetDetail.treatmentProtocols.map((p) => (
                      <li key={p.id} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs text-muted-foreground">v{p.version}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{p.issuer} &middot; {p.issueDate}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">Không tìm thấy bệnh lý</div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
