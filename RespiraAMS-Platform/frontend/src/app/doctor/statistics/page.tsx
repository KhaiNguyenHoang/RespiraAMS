"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts"
import { useStatistics } from "@/features/doctor/history/api"
import { getUser } from "@/lib/auth"

const severityLabels: Record<string, string> = {
  mild: "Nhẹ",
  moderate: "Trung bình",
  severe: "Nặng",
  critical: "Nguy kịch",
}

const severityColors = ["#22c55e", "#eab308", "#f97316", "#ef4444"]
const antibioticColors = ["#0c3660", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function StatisticsPage() {
  const user = getUser()
  const doctorId = user?.id ?? ""
  const [selectedYear, setSelectedYear] = useState(2026)
  const { data, isLoading } = useStatistics(doctorId, undefined, selectedYear)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const totalDecision = data?.totalDecision ?? []
  const accuracyData = data?.recommendationAccuracy ?? []
  const antibioticData = data?.antibioticConsumptionRates ?? []

  const lineData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const acc = accuracyData.find((a) => a.month === month)
    return {
      month: `Th${month}`,
      accuracy: acc ? Number((acc.accuracy * 100).toFixed(1)) : 0,
    }
  })

  const severityData = totalDecision.map((d, i) => ({
    name: severityLabels[d.severity] ?? d.severity,
    value: d.count,
    color: severityColors[i] ?? "#6b7280",
  }))

  const totalCases = totalDecision.reduce((s, d) => s + d.count, 0)

  return (
    <div className="container mx-auto px-4 pt-8 pb-4">
      <header className="mb-8">
        <p className="text-primary text-sm uppercase tracking-widest">Thống kê</p>
        <h1 className="text-3xl font-bold mt-2">Thống kê cá nhân</h1>
        <p className="text-muted-foreground mt-2">
          Tổng quan về các ca chẩn đoán đã thực hiện.
        </p>
      </header>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base">Độ chính xác khuyến nghị theo tháng</CardTitle>
            <span className="text-base">Tổng: {totalCases} ca</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedYear(selectedYear - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-20 text-center">{selectedYear}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedYear(selectedYear + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" interval={0} tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Độ chính xác"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mức độ nghiêm trọng</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {severityData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10">Chưa có dữ liệu</p>
            ) : (
              <PieChart width={280} height={250}>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {severityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tỷ lệ tiêu thụ kháng sinh</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {antibioticData.length === 0 ? (
              <p className="text-sm text-muted-foreground py-10">Chưa có dữ liệu</p>
            ) : (
              <PieChart width={320} height={280}>
                <Pie
                  data={antibioticData.map((d) => ({
                    name: d.category,
                    value: d.count,
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {antibioticData.map((_, i) => (
                    <Cell key={i} fill={antibioticColors[i % antibioticColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const count = props?.payload?.count ?? 0
                    const total = antibioticData.reduce((s, d) => s + d.count, 0)
                    const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0"
                    return [`${count} ca (${pct}%)`, name]
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-muted-foreground">{value}</span>
                  )}
                />
              </PieChart>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
