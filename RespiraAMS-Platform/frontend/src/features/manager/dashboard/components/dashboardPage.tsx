"use client"

import { useState, useMemo } from "react"
import { useStatistics } from "../queries"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"
import { InfiniteDoctorSelect } from "./infiniteDoctorSelect"

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

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const y = parseInt(e.target.value)
        setSelectedYear(y)
        if (y === currentYear && selectedMonth > currentMonth) {
            setSelectedMonth(currentMonth)
        }
    }

    const COLORS = ['#0c3660', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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
                        <select 
                            value={selectedYear} 
                            onChange={handleYearChange}
                            className="flex h-[42px] w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-zinc-600 uppercase">Month</label>
                        <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            className="flex h-[42px] w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>
            ) : isError || !stats ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg font-bold border border-red-200">
                    Failed to fetch statistics data.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <Card className="shadow-sm border md:col-span-2">
                        <CardHeader>
                            <CardTitle>Total Decisions by Severity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                                {stats.totalDecision.length > 0 ? (

                                stats.totalDecision.map((item, i) => (
                                    <div key={i} className="bg-zinc-50 border p-4 rounded-xl flex flex-col items-center justify-center">
                                        <p className="text-sm font-semibold text-zinc-500 uppercase">{item.severity}</p>
                                        <p className="text-3xl font-bold text-primary mt-1">{item.count} <span className="text-base font-medium text-zinc-400">ca</span></p>
                                    </div>
                                ))

                                ) : (
                                    <p className="text-zinc-400 italic text-sm absolute">No decision data data for this month.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border">
                        <CardHeader>
                            <CardTitle>Recommendation Accuracy</CardTitle>
                            <CardDescription>Line chart displaying accuracy for each month in {selectedYear}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4">
                                {stats.recommendationAccuracy.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={[...stats.recommendationAccuracy].sort((a, b) => a.month - b.month)}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                                        <XAxis dataKey="month" tickFormatter={(val) => `T${val}`} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                        <YAxis tickFormatter={(val) => `${(val * 100).toFixed(0)}%`} domain={[0, 1]} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                        <Tooltip 
                                            formatter={(value) => {
                                                if (typeof value !== 'number') {
                                                    return ['N/A', 'Độ chính xác']
                                                }
                                                return [`${(value * 100).toFixed(1)}%`, 'Độ chính xác']
                                            }}
                                            labelFormatter={(label) => `Tháng ${label}`}
                                            contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Line type="monotone" dataKey="accuracy" stroke="#0c3660" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                                ) : (
                                    <p className="text-zinc-400 italic text-sm absolute">No consumption data for this year.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border">
                        <CardHeader>
                            <CardTitle>Antibiotic Consumption Rates</CardTitle>
                            <CardDescription>Antibiotic consumption rates by AWaRe categories for {selectedMonth}/{selectedYear}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full mt-4 flex justify-center items-center relative">
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
                                                        ? `${(numericValue * 100).toFixed(1)}% (${props?.payload?.count ?? 0} ca)`
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
            )}
        </div>
    )
}