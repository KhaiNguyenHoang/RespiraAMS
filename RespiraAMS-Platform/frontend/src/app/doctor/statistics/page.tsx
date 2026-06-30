"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts"
import { SavedDiagnose } from "@/features/doctor/history/storage"

const severityLabels: Record<string, string> = {
  mild: "Nhẹ",
  moderate: "Trung bình",
  severe: "Nặng",
  critical: "Nguy kịch",
}

const treatmentSiteLabels: Record<string, string> = {
  outpatient: "Ngoại trú",
  inpatient: "Nội trú",
  intensiveCareUnit: "Khoa ICU",
}

const severityColors = ["#22c55e", "#eab308", "#f97316", "#ef4444"]
const siteColors = ["#3b82f6", "#8b5cf6", "#ec4899"]
const lineColors = ["#2563eb", "#dc2626", "#d97706", "#059669", "#7c3aed"]

const mockHistory: SavedDiagnose[] = [
  { id: "1", timestamp: "2026-06-28T09:30:00", patientName: "Nguyễn Văn An", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "2", timestamp: "2026-06-27T14:15:00", patientName: "Trần Thị Bình", diseaseName: "Viêm phổi bệnh viện", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "3", timestamp: "2026-05-25T11:00:00", patientName: "Lê Văn Cường", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "4", timestamp: "2026-05-24T16:45:00", patientName: "Phạm Thị Dung", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "5", timestamp: "2026-05-22T08:20:00", patientName: "Hoàng Văn Em", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "6", timestamp: "2026-04-20T10:30:00", patientName: "Đỗ Thị Phương", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "7", timestamp: "2026-04-18T13:00:00", patientName: "Vũ Văn Giang", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "8", timestamp: "2026-04-15T15:10:00", patientName: "Ngô Thị Hạnh", diseaseName: "Viêm phổi hít", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "9", timestamp: "2026-06-12T08:00:00", patientName: "Đặng Văn Inh", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "10", timestamp: "2026-06-10T14:30:00", patientName: "Bùi Thị Kim", diseaseName: "Viêm phổi bệnh viện", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "11", timestamp: "2026-06-08T09:00:00", patientName: "Mai Văn Bình", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "12", timestamp: "2026-06-06T14:30:00", patientName: "Nguyễn Thị Đào", diseaseName: "Viêm phổi hít", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "13", timestamp: "2026-06-04T11:00:00", patientName: "Trần Văn Hải", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "14", timestamp: "2026-06-02T08:00:00", patientName: "Dương Văn Lâm", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "15", timestamp: "2026-05-30T11:15:00", patientName: "Mai Thị Mai", diseaseName: "Viêm phổi hít", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "16", timestamp: "2026-05-28T09:00:00", patientName: "Đặng Thị Thu", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "17", timestamp: "2026-05-26T16:00:00", patientName: "Lê Văn Khang", diseaseName: "Viêm phổi bệnh viện", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "18", timestamp: "2026-05-20T10:30:00", patientName: "Đỗ Thị Phương", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "19", timestamp: "2026-05-18T13:00:00", patientName: "Vũ Văn Giang", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "20", timestamp: "2026-05-16T09:00:00", patientName: "Trịnh Văn Nam", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "21", timestamp: "2026-05-14T16:00:00", patientName: "Lý Thị Oanh", diseaseName: "Viêm phổi bệnh viện", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "22", timestamp: "2026-05-12T11:30:00", patientName: "Võ Văn Phúc", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "23", timestamp: "2026-05-10T09:30:00", patientName: "Tạ Thị Quyên", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "24", timestamp: "2026-05-08T14:00:00", patientName: "Phùng Văn Sơn", diseaseName: "Viêm phổi bệnh viện", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "25", timestamp: "2026-05-06T10:00:00", patientName: "Hồ Thị Trang", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "26", timestamp: "2026-05-04T09:30:00", patientName: "Phan Thị Huệ", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "27", timestamp: "2026-05-02T13:00:00", patientName: "Hoàng Văn Tú", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "28", timestamp: "2026-04-30T10:00:00", patientName: "Vũ Thị Ngọc", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "29", timestamp: "2026-04-28T09:30:00", patientName: "Tạ Thị Quyên", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "30", timestamp: "2026-04-26T14:00:00", patientName: "Phùng Văn Sơn", diseaseName: "Viêm phổi bệnh viện", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "31", timestamp: "2026-04-24T10:00:00", patientName: "Hồ Thị Trang", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "32", timestamp: "2026-04-22T08:45:00", patientName: "Đinh Văn Út", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "33", timestamp: "2026-04-20T13:20:00", patientName: "Lương Thị Vân", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "34", timestamp: "2026-04-18T10:00:00", patientName: "Nguyễn Văn An", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "35", timestamp: "2026-04-16T09:00:00", patientName: "Cao Thị Xuân", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "36", timestamp: "2026-04-14T14:30:00", patientName: "Hà Văn Yên", diseaseName: "Viêm phổi bệnh viện", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "37", timestamp: "2026-04-12T16:00:00", patientName: "Phan Thị Hồng", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "38", timestamp: "2026-04-10T08:30:00", patientName: "Trần Văn Bảo", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "39", timestamp: "2026-04-08T13:00:00", patientName: "Nguyễn Thị Cúc", diseaseName: "Viêm phổi hít", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "40", timestamp: "2026-04-06T09:00:00", patientName: "Lý Văn Minh", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "41", timestamp: "2026-04-04T14:00:00", patientName: "Trương Thị Nhung", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "42", timestamp: "2026-04-02T11:30:00", patientName: "Đỗ Văn Phát", diseaseName: "Viêm phổi hít", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "43", timestamp: "2026-03-30T08:00:00", patientName: "Nguyễn Thị Lan", diseaseName: "Viêm phổi cộng đồng", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "44", timestamp: "2026-03-28T09:30:00", patientName: "Nguyễn Văn An", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "45", timestamp: "2026-03-26T14:00:00", patientName: "Trần Thị Bình", diseaseName: "Viêm phổi bệnh viện", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "46", timestamp: "2026-03-24T11:00:00", patientName: "Lê Văn Cường", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "47", timestamp: "2026-03-22T16:45:00", patientName: "Phạm Thị Dung", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "48", timestamp: "2026-03-20T08:20:00", patientName: "Hoàng Văn Em", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "49", timestamp: "2026-03-18T10:30:00", patientName: "Đỗ Thị Phương", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "50", timestamp: "2026-03-16T13:00:00", patientName: "Vũ Văn Giang", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "51", timestamp: "2026-03-14T15:10:00", patientName: "Ngô Thị Hạnh", diseaseName: "Viêm phổi hít", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "52", timestamp: "2026-03-12T09:00:00", patientName: "Đỗ Văn Phát", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "53", timestamp: "2026-03-10T08:30:00", patientName: "Trần Văn Bảo", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "54", timestamp: "2026-03-08T13:00:00", patientName: "Nguyễn Thị Cúc", diseaseName: "Viêm phổi hít", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "55", timestamp: "2026-03-06T09:00:00", patientName: "Lý Văn Minh", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "56", timestamp: "2026-03-04T14:00:00", patientName: "Trương Thị Nhung", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "57", timestamp: "2026-03-02T11:30:00", patientName: "Đỗ Văn Phát", diseaseName: "Viêm phổi hít", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "58", timestamp: "2026-02-28T08:00:00", patientName: "Nguyễn Thị Lan", diseaseName: "Viêm phổi cộng đồng", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "59", timestamp: "2026-02-26T09:30:00", patientName: "Nguyễn Văn An", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "60", timestamp: "2026-02-24T14:00:00", patientName: "Trần Thị Bình", diseaseName: "Viêm phổi bệnh viện", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "61", timestamp: "2026-02-22T11:00:00", patientName: "Lê Văn Cường", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "62", timestamp: "2026-02-20T16:45:00", patientName: "Phạm Thị Dung", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "63", timestamp: "2026-02-18T08:20:00", patientName: "Hoàng Văn Em", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "64", timestamp: "2026-02-16T10:30:00", patientName: "Đỗ Thị Phương", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "65", timestamp: "2026-02-14T10:00:00", patientName: "Phạm Văn Tùng", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "66", timestamp: "2026-02-12T15:30:00", patientName: "Trần Thị Xuân", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "67", timestamp: "2026-02-10T09:00:00", patientName: "Lê Văn Hoàng", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "68", timestamp: "2026-02-08T13:00:00", patientName: "Nguyễn Thị Mai", diseaseName: "Viêm phổi bệnh viện", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "69", timestamp: "2026-02-06T11:00:00", patientName: "Vũ Văn Thanh", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "70", timestamp: "2026-02-04T16:00:00", patientName: "Đặng Thị Hoa", diseaseName: "Viêm phổi hít", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "71", timestamp: "2026-02-02T08:30:00", patientName: "Hoàng Văn Đức", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "72", timestamp: "2026-01-30T09:30:00", patientName: "Lý Thị Oanh", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "73", timestamp: "2026-01-28T14:15:00", patientName: "Võ Văn Phúc", diseaseName: "Viêm phổi bệnh viện", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "74", timestamp: "2026-01-26T11:00:00", patientName: "Tạ Thị Quyên", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "75", timestamp: "2026-01-24T16:45:00", patientName: "Phùng Văn Sơn", diseaseName: "Viêm phổi hít", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "76", timestamp: "2026-01-22T08:20:00", patientName: "Hồ Thị Trang", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "77", timestamp: "2026-01-20T13:00:00", patientName: "Đinh Văn Út", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "78", timestamp: "2026-01-18T15:10:00", patientName: "Lương Thị Vân", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "79", timestamp: "2026-01-16T10:00:00", patientName: "Phùng Thị Lý", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "80", timestamp: "2026-01-14T14:00:00", patientName: "Tạ Văn Sinh", diseaseName: "Viêm phổi bệnh viện", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "81", timestamp: "2026-01-12T09:30:00", patientName: "Hồ Thị Hương", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "82", timestamp: "2026-01-10T16:00:00", patientName: "Đinh Văn Thắng", diseaseName: "Viêm phổi hít", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "83", timestamp: "2026-01-08T11:00:00", patientName: "Lương Thị Hạnh", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "84", timestamp: "2026-01-06T08:00:00", patientName: "Cao Văn Phú", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "85", timestamp: "2026-01-04T09:30:00", patientName: "Phạm Thị Yến", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "86", timestamp: "2026-01-02T14:15:00", patientName: "Hoàng Văn Tiến", diseaseName: "Viêm phổi bệnh viện", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "87", timestamp: "2025-12-28T09:30:00", patientName: "Nguyễn Thị Kim", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "88", timestamp: "2025-12-26T16:45:00", patientName: "Trần Văn Bảy", diseaseName: "Viêm phổi hít", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p4", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Clindamycin" },
  { id: "89", timestamp: "2025-12-24T08:20:00", patientName: "Lê Thị Thu", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "90", timestamp: "2025-12-22T09:30:00", patientName: "Đặng Văn Đạt", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "91", timestamp: "2025-12-20T14:00:00", patientName: "Bùi Thị Ngân", diseaseName: "Viêm phổi bệnh viện", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "92", timestamp: "2025-12-18T11:00:00", patientName: "Dương Văn Tâm", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "93", timestamp: "2025-12-16T16:00:00", patientName: "Mai Thị Hằng", diseaseName: "Viêm phổi hít", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "94", timestamp: "2025-12-14T08:00:00", patientName: "Trịnh Văn Lộc", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "95", timestamp: "2025-12-12T09:00:00", patientName: "Lý Thị Thơm", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
  { id: "96", timestamp: "2025-12-10T14:30:00", patientName: "Võ Văn Khải", diseaseName: "Viêm phổi bệnh viện", severity: "severe", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p2", selectedProtocolName: "Phác đồ kháng sinh kháng MRSA" },
  { id: "97", timestamp: "2025-12-08T11:00:00", patientName: "Tạ Thị Lài", diseaseName: "Viêm phổi cộng đồng", severity: "moderate", treatmentSite: "inpatient", selectedProtocolId: "p1", selectedProtocolName: "Phác đồ kháng sinh β-lactam + Macrolid" },
  { id: "98", timestamp: "2025-12-06T16:45:00", patientName: "Phùng Văn Hậu", diseaseName: "Viêm phổi hít", severity: "critical", treatmentSite: "intensiveCareUnit", selectedProtocolId: "p6", selectedProtocolName: "Phác đồ kháng sinh phổ rộng + Metronidazol" },
  { id: "99", timestamp: "2025-12-04T08:20:00", patientName: "Hồ Thị Minh", diseaseName: "Viêm phổi cộng đồng", severity: "severe", treatmentSite: "inpatient", selectedProtocolId: "p5", selectedProtocolName: "Phác đồ kháng sinh Fluoroquinolon hô hấp" },
  { id: "100", timestamp: "2025-12-02T13:00:00", patientName: "Đinh Văn Phương", diseaseName: "Viêm phổi cộng đồng", severity: "mild", treatmentSite: "outpatient", selectedProtocolId: "p3", selectedProtocolName: "Phác đồ Amoxicillin/Clavulanat" },
]

interface PieDataItem {
  name: string
  value: number
  color: string
}

export default function StatisticsPage() {
  const history = mockHistory

  const { availableYears } = useMemo(() => {
    const years = new Set<number>()
    history.forEach((r) => years.add(new Date(r.timestamp).getFullYear()))
    return { availableYears: Array.from(years).sort() }
  }, [history])

  const [selectedYear, setSelectedYear] = useState(availableYears[availableYears.length - 1])

  const { lineData, diseaseNames, yearTotal } = useMemo(() => {
    const monthMap: Record<string, Record<string, number>> = {}
    const diseaseSet = new Set<string>()
    let total = 0

    history.forEach((r) => {
      const d = new Date(r.timestamp)
      if (d.getFullYear() !== selectedYear) return
      total++
      const month = `Th${d.getMonth() + 1}/${selectedYear}`
      if (!monthMap[month]) monthMap[month] = {}
      monthMap[month][r.diseaseName] = (monthMap[month][r.diseaseName] ?? 0) + 1
      diseaseSet.add(r.diseaseName)
    })

    const names = Array.from(diseaseSet)
    const data = Array.from({ length: 12 }, (_, i) => {
      const monthLabel = `Th${i + 1}/${selectedYear}`
      const point: Record<string, string | number> = { month: `Th${i + 1}` }
      names.forEach((disease) => {
        point[disease] = monthMap[monthLabel]?.[disease] ?? 0
      })
      return point
    })

    return { lineData: data, diseaseNames: names, yearTotal: total }
  }, [history, selectedYear])

  const severityCount: Record<string, number> = {}
  const siteCount: Record<string, number> = {}

  history.forEach((r) => {
    severityCount[r.severity] = (severityCount[r.severity] ?? 0) + 1
    siteCount[r.treatmentSite] = (siteCount[r.treatmentSite] ?? 0) + 1
  })

  const severityData: PieDataItem[] = Object.entries(severityCount).map(([key, count], i) => ({
    name: severityLabels[key] ?? key,
    value: count,
    color: severityColors[i] ?? "#6b7280",
  }))

  const siteData: PieDataItem[] = Object.entries(siteCount).map(([key, count], i) => ({
    name: treatmentSiteLabels[key] ?? key,
    value: count,
    color: siteColors[i] ?? "#6b7280",
  }))

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
            <CardTitle className="text-base">Số ca mắc theo tháng</CardTitle>
            <span className="text-base">Tổng: {yearTotal} ca</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!availableYears.includes(selectedYear - 1)}
              onClick={() => setSelectedYear(selectedYear - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-semibold min-w-20 text-center">{selectedYear}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={!availableYears.includes(selectedYear + 1)}
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
              <YAxis domain={[0, 20]} allowDecimals={false} />
              <Tooltip />
              <Legend />
              {diseaseNames.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={lineColors[i % lineColors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nơi điều trị</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PieChart width={280} height={250}>
              <Pie
                data={siteData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {siteData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                formatter={(value) => (
                  <span className="text-sm text-muted-foreground">{value}</span>
                )}
              />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}