"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useAntibiotics, usePathogens, useDiseases } from "@/features/doctor/info/api"
import { AntibioticItem, PathogenItem } from "@/features/doctor/info/types"

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
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thuốc</TableHead>
                <TableHead>Phổ kháng khuẩn</TableHead>
                <TableHead>Phân loại</TableHead>
                <TableHead>Đường dùng</TableHead>
                <TableHead>Liều dùng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Đang tải...</TableCell>
                </TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">Không có dữ liệu</TableCell>
                </TableRow>
              )}
              {filtered.map((item: AntibioticItem) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.antibioticSpectrum.name}</TableCell>
                  <TableCell className="capitalize">{item.category}</TableCell>
                  <TableCell>{item.routeOfAdministrations.join(", ")}</TableCell>
                  <TableCell>
                    {item.routeOfAdministrations.map((route) => (
                      <div key={route} className="text-sm">
                        <span className="font-medium uppercase text-xs">{route}:</span>
                        <ul className="list-disc pl-4">
                          {item.dosages[route]?.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên tác nhân</TableHead>
                <TableHead>Mô tả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">Đang tải...</TableCell>
                </TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">Không có dữ liệu</TableCell>
                </TableRow>
              )}
              {filtered.map((item: PathogenItem) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="whitespace-normal wrap-break-word">{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên bệnh</TableHead>
                <TableHead>Mô tả</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">Đang tải...</TableCell>
                </TableRow>
              )}
              {!isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">Không có dữ liệu</TableCell>
                </TableRow>
              )}
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="whitespace-normal wrap-break-word">{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function InfoPage() {
  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <header className="mb-8">
        <p className="text-primary text-sm uppercase tracking-widest">Tra cứu</p>
        <h1 className="text-3xl font-bold mt-2">Thông tin tham khảo</h1>
        <p className="text-muted-foreground mt-2">
          Tra cứu thông tin về thuốc, tác nhân gây bệnh và bệnh lý.
        </p>
      </header>

      <Tabs defaultValue="antibiotics">
        <TabsList>
          <TabsTrigger value="antibiotics">Thuốc kháng sinh</TabsTrigger>
          <TabsTrigger value="pathogens">Tác nhân gây bệnh</TabsTrigger>
          <TabsTrigger value="diseases">Bệnh lý</TabsTrigger>
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
      </Tabs>
    </div>
  )
}
