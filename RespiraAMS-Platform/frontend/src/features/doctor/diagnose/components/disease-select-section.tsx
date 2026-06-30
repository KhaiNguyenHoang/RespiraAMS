"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useDiseases } from "@/features/doctor/diagnose/api"
import { DiseaseItem } from "@/features/doctor/diagnose/types"

interface DiseaseSelectSectionProps {
  value: string
  onValueChange: (value: string) => void
}

export function DiseaseSelectSection({ value, onValueChange }: DiseaseSelectSectionProps) {
  const { data, isLoading, isError } = useDiseases({ page: 1, size: 100 })

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Chọn bệnh lý nghi ngờ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-w-md">
          <label className="text-sm font-medium">Bệnh lý<span className="text-red-500">*</span></label>
          <Select value={value || undefined} onValueChange={onValueChange}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn bệnh lý"} />
            </SelectTrigger>
            <SelectContent position="popper">
              {isLoading && (
                <SelectItem value="loading" disabled>
                  Đang tải dữ liệu...
                </SelectItem>
              )}
              {isError && (
                <SelectItem value="error" disabled>
                  Lỗi tải dữ liệu
                </SelectItem>
              )}
              {!isLoading && !isError && (!data?.items || data.items.length === 0) && (
                <SelectItem value="empty" disabled>
                  Không có bệnh lý nào
                </SelectItem>
              )}
              {data?.items.map((disease: DiseaseItem) => (
                <SelectItem key={disease.id} value={disease.id}>
                  {disease.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
