"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Bug, Stethoscope, Pill, FileText } from "lucide-react"
import { useAntibiotics, usePathogens, useDiseases, useTreatmentProtocols } from "@/features/doctor/info/api"
import { AntibioticItem, PathogenItem, TreatmentProtocolItem } from "@/features/doctor/info/types"

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
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary shrink-0" />
                  {item.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Phổ kháng khuẩn</p>
                  <p className="text-sm font-medium">{item.antibioticSpectrum.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Phân loại</p>
                  <p className="text-sm font-medium capitalize">{item.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Đường dùng</p>
                  <p className="text-sm">{item.routeOfAdministrations.join(", ")}</p>
                </div>
                {item.routeOfAdministrations.map((route) => (
                  <div key={route}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{route}</p>
                    <ul className="list-disc pl-4 text-sm">
                      {item.dosages[route]?.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                ))}
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
            <Card key={item.id}>
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

function DiseasesTab() {
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
          {filtered.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary shrink-0" />
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

// function ProtocolsTab() {
//   const { data, isLoading } = useTreatmentProtocols({ page: 1, size: 100 })
//   const [search, setSearch] = useState("")

//   const items = data?.items ?? []
//   const filtered = items.filter(
//     (p) =>
//       p.name.toLowerCase().includes(search.toLowerCase()) ||
//       p.issuer.toLowerCase().includes(search.toLowerCase())
//   )

//   return (
//     <div className="space-y-4">
//       <div className="relative max-w-sm">
//         <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//         <Input
//           placeholder="Tìm phác đồ..."
//           className="pl-8"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>
//       {isLoading ? (
//         <div className="text-center py-12 text-sm text-muted-foreground">Đang tải...</div>
//       ) : filtered.length === 0 ? (
//         <div className="text-center py-12 text-sm text-muted-foreground">Không có dữ liệu</div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {filtered.map((item: TreatmentProtocolItem) => (
//             <Card key={item.id}>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-primary shrink-0" />
//                   {item.name}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center gap-3 text-xs text-muted-foreground">
//                   <span className="rounded bg-muted px-2 py-0.5 font-medium">v{item.version}</span>
//                   <span>{item.issuer}</span>
//                   <span>{item.issueDate}</span>
//                 </div>
//                 <div>
//                   <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Thuốc trong phác đồ</p>
//                   <div className="space-y-2">
//                     {item.medicines.map((m) => (
//                       <div key={m.id} className="rounded-lg border p-3">
//                         <p className="text-sm font-medium">{m.name}</p>
//                         <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
//                           <p>Phổ: {m.antibioticSpectrum.name}</p>
//                           <p className="capitalize">Phân loại: {m.category}</p>
//                           <p>Đường dùng: {m.routeOfAdministrations.join(", ")}</p>
//                         </div>
//                         {m.routeOfAdministrations.map((route) => (
//                           <div key={route} className="mt-1">
//                             <p className="text-xs font-medium uppercase text-muted-foreground">{route}</p>
//                             <ul className="list-disc pl-4 text-xs text-muted-foreground">
//                               {m.dosages[route]?.map((d, i) => <li key={i}>{d}</li>)}
//                             </ul>
//                           </div>
//                         ))}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

export default function InfoPage() {
  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <header className="mb-8">
        <p className="text-primary text-sm uppercase tracking-widest">Tra cứu</p>
        <h1 className="text-3xl font-bold mt-2">Thông tin tham khảo</h1>
        <p className="text-muted-foreground mt-2">
          Tra cứu thông tin về thuốc, tác nhân gây bệnh, bệnh lý và phác đồ điều trị.
        </p>
      </header>

      <Tabs defaultValue="antibiotics">
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
          <DiseasesTab />
        </TabsContent>
        <TabsContent value="protocols" className="mt-6">
          {/* <ProtocolsTab /> */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
