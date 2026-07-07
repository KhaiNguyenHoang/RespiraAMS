"use client"

import { useState, useMemo } from "react"
import { useStatistics } from "../queries"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { InfiniteDoctorSelect } from "./infiniteDoctorSelect"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
    const [selectedYear, setSelectedYear] = useState<number>(currentYear)
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)

    const { data: stats, isLoading, isError } = useStatistics(selectedDoctorId, selectedMonth, selectedYear)

    const years = useMemo(() => {
        const arr = []
        for (let y = currentYear; y >= 2025; y--) {
            arr.push(y)
        }
        return arr
    }, [currentYear])

    const months = useMemo(() => {
        const maxMonth = selectedYear === currentYear ? currentMonth : 12
        const arr = []
        for (let m = 1; m <= maxMonth; m++) {
            arr.push(m)
        }
        return arr
    }, [selectedYear, currentYear, currentMonth])

    const handleYearChange = (value: string) => {
        const y = parseInt(value)
        setSelectedYear(y)
        if (y === currentYear && selectedMonth > currentMonth) {
            setSelectedMonth(currentMonth)
        }
    }

    const severityLabels: Record<string, string> = {
        mild: "Nhẹ",
        moderate: "Trung bình",
        severe: "Nặng",
        critical: "Nguy kịch",
    }

    const severityColors = ["#22c55e", "#eab308", "#f97316", "#ef4444"]

    const COLORS = ['#0c3660', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const lineData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const acc = (stats?.recommendationAccuracy ?? []).find((a) => a.month === month)
        return {
            month: `Th${month}`,
            accuracy: acc ? Number((acc.accuracy * 100).toFixed(1)) : 0,
        }
    })

    return (
        <div className="container mx-auto pb-10 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-primary">Statistics Dashboard</h1>
            </div>

            <Card className="shadow-sm">
                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase">Filter by Doctor</label>
                        <InfiniteDoctorSelect value={selectedDoctorId} onChange={setSelectedDoctorId} />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase">Year</label>
                        <Select value={String(selectedYear)} onValueChange={handleYearChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" side="bottom">
                                {years.map(y => (
                                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase">Month</label>
                        <Select
                            value={String(selectedMonth)}
                            onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" side="bottom">
                                {months.map(m => (
                                    <SelectItem key={m} value={String(m)}>Tháng {m}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-100 w-full rounded-xl" />
                    <Skeleton className="h-100 w-full rounded-xl" />
                </div>
            ) : isError || !stats ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg font-bold border border-red-200">
                    Failed to fetch statistics data.
                </div>
            ) : (
                <div className="space-y-6">
                    <Card className="shadow-sm border">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recommendation Accuracy</CardTitle>
                                <CardDescription>Line chart displaying accuracy for each month in {selectedYear}</CardDescription>
                            </div>
                            <span className="text-base font-semibold">
                                Total: {stats.totalDecision.reduce((s, d) => s + d.count, 0)} cases
                            </span>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" interval={0} tick={{ fontSize: 11 }} />
                                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
                                    <Tooltip formatter={(v) => `${v}%`} />
                                    <Legend />
                                    <Line type="monotone" dataKey="accuracy" name="Accuracy" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="shadow-sm border">
                            <CardHeader>
                                <CardTitle>Total Decisions by Severity</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                {stats.totalDecision.length > 0 ? (
                                    <PieChart width={320} height={280}>
                                        <Pie
                                            data={stats.totalDecision.map((d) => ({
                                                name: severityLabels[d.severity] ?? d.severity,
                                                value: d.count,
                                            }))}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={100}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {stats.totalDecision.map((_, i) => (
                                                <Cell key={i} fill={severityColors[i % severityColors.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                            formatter={(value) => (
                                                <span className="text-sm text-muted-foreground">{value}</span>
                                            )}
                                        />
                                    </PieChart>
                                ) : (
                                    <p className="text-sm text-muted-foreground py-10">No decision data for this month.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border">
                            <CardHeader>
                                <CardTitle>Antibiotic Consumption Rates</CardTitle>
                                <CardDescription>By AWaRe categories for {selectedMonth}/{selectedYear}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-75 w-full mt-4 flex justify-center items-center relative">
                                    {stats.antibioticConsumptionRates.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.antibioticConsumptionRates}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="rate"
                                                    nameKey="category"
                                                >
                                                    {stats.antibioticConsumptionRates.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value, name, props) => {
                                                        const numericValue = typeof value === 'number' ? value : Number(value)
                                                        const rateLabel = Number.isFinite(numericValue)
                                                            ? `${(numericValue * 100).toFixed(1)}% (${props?.payload?.count ?? 0} cases)`
                                                            : 'N/A'
                                                        return [rateLabel, name ?? '']
                                                    }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <p className="text-zinc-400 italic text-sm absolute">No consumption data for this month.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}