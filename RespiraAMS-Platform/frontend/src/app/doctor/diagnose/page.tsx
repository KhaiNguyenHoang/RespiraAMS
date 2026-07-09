"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDisease, useDiagnosisTemplate } from "@/features/doctor/diagnose/api"
import { diagnose } from "@/features/doctor/diagnose/api"
import { DiagnoseResponse, TreatmentProtocolItem } from "@/features/doctor/diagnose/types"
import { useCreateTreatmentDecision } from "@/features/doctor/history/api"
import { TreatmentProtocolSnapshotDTo } from "@/features/doctor/history/types"
import { PatientInfoSection } from "@/features/doctor/diagnose/components/patient-info-section"
import { DiseaseSelectSection } from "@/features/doctor/diagnose/components/disease-select-section"
import { IcuCriteriaSection } from "@/features/doctor/diagnose/components/icu-criteria-section"
import { Curb65Section } from "@/features/doctor/diagnose/components/curb65-section"
import { ResistanceRiskSection } from "@/features/doctor/diagnose/components/resistance-risk-section"
import { OtherCriteriaSection } from "@/features/doctor/diagnose/components/other-criteria-section"
import { RecommendationView } from "@/features/doctor/diagnose/components/recommendation-view"
import { Loader2 } from "lucide-react"

function calculateAge(dob: Date | undefined): string {
  if (!dob) return "0"
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return String(age)
}

import { SeverityBadge } from "@/features/doctor/components/badges"
import { treatmentSiteLabels } from "@/features/doctor/lib/mappers"

interface FormValues {
  patientName: string
  dateOfBirth: Date | undefined
  gender: string
  confusion: boolean
  age65: boolean
  urea: string
  respiratory: string
  systolic: string
  diastolic: string
  icuCriteria: Record<string, boolean>
  icuNumericValues: Record<string, string>
  resistanceRisks: Record<string, boolean>
  resistanceNumericValues: Record<string, string>
  otherCriteriaChecked: Record<string, boolean>
  otherCriteriaNumericValues: Record<string, string>
}

const defaultFormValues: FormValues = {
  patientName: "",
  dateOfBirth: undefined,
  gender: "",
  confusion: false,
  age65: false,
  urea: "",
  respiratory: "",
  systolic: "",
  diastolic: "",
  icuCriteria: {},
  icuNumericValues: {},
  resistanceRisks: {},
  resistanceNumericValues: {},
  otherCriteriaChecked: {},
  otherCriteriaNumericValues: {},
}

export default function ClinicalFormPage() {
  const [selectedDiseaseId, setSelectedDiseaseId] = useState("")
  const [formValues, setFormValues] = useState<FormValues>(defaultFormValues)
  const [diagnoseResult, setDiagnoseResult] = useState<DiagnoseResponse | null>(null)
  const [showRecommendation, setShowRecommendation] = useState(false)
  const { data: disease, isLoading: diseaseLoading, isError: diseaseError } = useDisease(selectedDiseaseId)
  const { data: diagnosisTemplate, isLoading: templateLoading } = useDiagnosisTemplate(selectedDiseaseId)
  const otherCriteria = diagnosisTemplate?.otherCriteria ?? []

  const updateField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }))
  }

  const { mutate: handleDiagnose, isPending: isDiagnosing } = useMutation<DiagnoseResponse | null, Error>({
    mutationFn: () => {
      const checkedIcuCriteria: string[] = Object.entries(formValues.icuCriteria)
        .filter(([, checked]) => checked)
        .map(([id]) => id)

      const icuNumericWithValues: string[] = Object.entries(formValues.icuNumericValues)
        .filter(([, value]) => value !== "")
        .map(([id]) => id)

      const checkedResistanceRisks: string[] = Object.entries(formValues.resistanceRisks)
        .filter(([, checked]) => checked)
        .map(([id]) => id)

      const resistanceNumericWithValues: string[] = Object.entries(formValues.resistanceNumericValues)
        .filter(([, value]) => value !== "")
        .map(([id]) => id)

      const checkedOtherCriteria: string[] = Object.entries(formValues.otherCriteriaChecked)
        .filter(([, checked]) => checked)
        .map(([id]) => id)

      const otherCriteriaNumericWithValues: string[] = Object.entries(formValues.otherCriteriaNumericValues)
        .filter(([, value]) => value !== "")
        .map(([id]) => id)

      return diagnose({
        diseaseId: selectedDiseaseId,
        confusion: formValues.confusion,
        urea: formValues.urea,
        respiratory: formValues.respiratory,
        systolic: formValues.systolic,
        diastolic: formValues.diastolic,
        age: calculateAge(formValues.dateOfBirth),
        icuHospitalizeCriteria: [...checkedIcuCriteria, ...icuNumericWithValues],
        resistanceRiskFactors: [...checkedResistanceRisks, ...resistanceNumericWithValues],
        otherCriteria: [...checkedOtherCriteria, ...otherCriteriaNumericWithValues],
      })
    },
    onSuccess: (data) => {
      if (data) {
        setDiagnoseResult(data)
      }
    },
    onError: (error: Error) => {
      console.error("Chẩn đoán thất bại:", error)
    },
  })

  const { mutate: handleDiagnoseAndRecommend, isPending: isSending } = useMutation<DiagnoseResponse | null, Error>({
    mutationFn: () => {
      const checkedIcuCriteria: string[] = Object.entries(formValues.icuCriteria)
        .filter(([, checked]) => checked)
        .map(([id]) => id)

      const icuNumericWithValues: string[] = Object.entries(formValues.icuNumericValues)
        .filter(([, value]) => value !== "")
        .map(([id]) => id)

      const checkedResistanceRisks: string[] = Object.entries(formValues.resistanceRisks)
        .filter(([, checked]) => checked)
        .map(([id]) => id)

      const resistanceNumericWithValues: string[] = Object.entries(formValues.resistanceNumericValues)
        .filter(([, value]) => value !== "")
        .map(([id]) => id)

      const checkedOtherCriteria: string[] = Object.entries(formValues.otherCriteriaChecked)
        .filter(([, checked]) => checked)
        .map(([id]) => id)

      const otherCriteriaNumericWithValues: string[] = Object.entries(formValues.otherCriteriaNumericValues)
        .filter(([, value]) => value !== "")
        .map(([id]) => id)

      return diagnose({
        diseaseId: selectedDiseaseId,
        confusion: formValues.confusion,
        urea: formValues.urea,
        respiratory: formValues.respiratory,
        systolic: formValues.systolic,
        diastolic: formValues.diastolic,
        age: calculateAge(formValues.dateOfBirth),
        icuHospitalizeCriteria: [...checkedIcuCriteria, ...icuNumericWithValues],
        resistanceRiskFactors: [...checkedResistanceRisks, ...resistanceNumericWithValues],
        otherCriteria: [...checkedOtherCriteria, ...otherCriteriaNumericWithValues],
      })
    },
    onSuccess: (data) => {
      if (data) {
        setDiagnoseResult(data)
        setShowRecommendation(true)
      }
    },
    onError: (error: Error) => {
      console.error("Gửi thông tin thất bại:", error)
    },
  })

  const handleReset = () => {
    setFormValues(defaultFormValues)
    setSelectedDiseaseId("")
    setDiagnoseResult(null)
  }

  const handleDiseaseChange = (id: string) => {
    setSelectedDiseaseId(id)
    setFormValues((prev) => ({
      ...prev,
      icuCriteria: {},
      icuNumericValues: {},
      resistanceRisks: {},
      resistanceNumericValues: {},
    }))
  }

  const { mutate: handleSaveDecision } = useCreateTreatmentDecision()

  const buildSnapshot = (p: TreatmentProtocolItem): TreatmentProtocolSnapshotDTo => ({
    treatmentProtocolId: p.id,
    treatmentProtocolName: p.name,
    treatmentProtocolIssuer: p.issuer,
    treatmentProtocolIssueDate: p.issueDate,
    treatmentProtocolVersion: p.version,
    medicines: p.medicines.map(m => ({
      name: m.name,
      antibioticSpectrum: m.antibioticSpectrum.name,
      category: m.category,
      dosages: m.dosages,
    })),
  })

  const handleSave = (selectedProtocolId: string, reason: string | undefined) => {
    if (!diagnoseResult || !disease) return
    const recommendedProtocol = diagnoseResult.recommend[0]
    const chosenProtocol = diagnoseResult.recommend.find(p => p.id === selectedProtocolId) || recommendedProtocol

    const criteriaSnapshots: { criterionId: string; criterionName: string; value: string | null }[] = []
    for (const [id, checked] of Object.entries(formValues.icuCriteria)) {
      if (!checked) continue
      const item = disease.icuHospitalizeCriteria.find(c => c.criterion.id === id)
      criteriaSnapshots.push({ criterionId: id, criterionName: item?.criterion.name ?? id, value: "true" })
    }
    for (const [id, value] of Object.entries(formValues.icuNumericValues)) {
      if (!value) continue
      const item = disease.icuHospitalizeCriteria.find(c => c.criterion.id === id)
      criteriaSnapshots.push({ criterionId: id, criterionName: item?.criterion.name ?? id, value })
    }
    for (const [id, checked] of Object.entries(formValues.resistanceRisks)) {
      if (!checked) continue
      const item = disease.resistanceRisks.find(r => r.criterion.id === id)
      criteriaSnapshots.push({ criterionId: id, criterionName: item?.criterion.name ?? id, value: "true" })
    }
    for (const [id, value] of Object.entries(formValues.resistanceNumericValues)) {
      if (!value) continue
      const item = disease.resistanceRisks.find(r => r.criterion.id === id)
      criteriaSnapshots.push({ criterionId: id, criterionName: item?.criterion.name ?? id, value })
    }

    handleSaveDecision({
      diseaseId: selectedDiseaseId,
      diseaseName: disease.name,
      severity: diagnoseResult.severity,
      treatmentSite: diagnoseResult.treatmentSite,
      infectionProbabilitySnapshots: diagnoseResult.infectionProbabilities.map(ip => ({
        pathogenId: ip.pathogenId,
        pathogenName: ip.pathogenName,
        infectionProbability: Number(ip.probability),
      })),
      criteriaSnapshots,
      recommended: buildSnapshot(recommendedProtocol),
      chosen: buildSnapshot(chosenProtocol),
      reason: reason ?? null,
    })
  }

  if (showRecommendation && diagnoseResult) {
    return (
      <div>
        <RecommendationView
          diagnoseResult={diagnoseResult}
          patientName={formValues.patientName}
          diseaseName={disease?.name ?? ""}
          onBack={() => setShowRecommendation(false)}
          onSave={handleSave}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-6 max-w-300 mx-auto px-4 pt-8 pb-4">
        <header className="mb-8">
          <p className="text-primary text-sm uppercase tracking-widest">
            Đánh giá ban đầu
          </p>
          <h1 className="text-3xl font-bold mt-2">
            Mẫu Thông tin Bệnh nhân
          </h1>
          <p className="text-muted-foreground mt-2">
            Vui lòng hoàn thành tất cả các trường thông tin cần thiết để đánh
            giá lâm sàng.
          </p>
        </header>

        <form
          className="space-y-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <PatientInfoSection
            patientName={formValues.patientName}
            dateOfBirth={formValues.dateOfBirth}
            gender={formValues.gender}
            onPatientNameChange={(v: string) => updateField("patientName", v)}
            onDateOfBirthChange={(v: Date | undefined) => updateField("dateOfBirth", v)}
            onGenderChange={(v: string) => updateField("gender", v)}
          />

          <DiseaseSelectSection
            value={selectedDiseaseId}
            onValueChange={handleDiseaseChange}
          />

          <Curb65Section
            confusion={formValues.confusion}
            age65={formValues.age65}
            urea={formValues.urea}
            respiratory={formValues.respiratory}
            systolic={formValues.systolic}
            diastolic={formValues.diastolic}
            onConfusionChange={(v: boolean) => updateField("confusion", v)}
            onAge65Change={(v: boolean) => updateField("age65", v)}
            onUreaChange={(v: string) => updateField("urea", v)}
            onRespiratoryChange={(v: string) => updateField("respiratory", v)}
            onSystolicChange={(v: string) => updateField("systolic", v)}
            onDiastolicChange={(v: string) => updateField("diastolic", v)}
          />

          {selectedDiseaseId && diseaseError && (
            <Card>
              <CardHeader>
                <CardTitle>Lỗi tải dữ liệu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-destructive">Không thể tải thông tin bệnh lý. Vui lòng thử lại.</p>
              </CardContent>
            </Card>
          )}

          {selectedDiseaseId && disease && (
            <>
              <IcuCriteriaSection
                disease={disease}
                loading={diseaseLoading}
                criteriaChecked={formValues.icuCriteria}
                numericValues={formValues.icuNumericValues}
                onCriteriaCheckChange={(id, checked) =>
                  updateField("icuCriteria", { ...formValues.icuCriteria, [id]: checked })
                }
                onNumericValueChange={(id, value) =>
                  updateField("icuNumericValues", { ...formValues.icuNumericValues, [id]: value })
                }
              />
              <ResistanceRiskSection
                disease={disease}
                loading={diseaseLoading}
                risksChecked={formValues.resistanceRisks}
                numericValues={formValues.resistanceNumericValues}
                onRiskCheckChange={(id, checked) =>
                  updateField("resistanceRisks", { ...formValues.resistanceRisks, [id]: checked })
                }
                onNumericValueChange={(id, value) =>
                  updateField("resistanceNumericValues", { ...formValues.resistanceNumericValues, [id]: value })
                }
              />
              <OtherCriteriaSection
                criteria={otherCriteria}
                loading={templateLoading}
                checked={formValues.otherCriteriaChecked}
                numericValues={formValues.otherCriteriaNumericValues}
                onCheckChange={(id, checked) =>
                  updateField("otherCriteriaChecked", { ...formValues.otherCriteriaChecked, [id]: checked })
                }
                onNumericValueChange={(id, value) =>
                  updateField("otherCriteriaNumericValues", { ...formValues.otherCriteriaNumericValues, [id]: value })
                }
              />
            </>
          )}

          {diagnoseResult && (
            <Card>
              <CardHeader>
                <CardTitle>Kết quả chẩn đoán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Mức độ nghiêm trọng</p>
                    <div className="mt-1"><SeverityBadge severity={diagnoseResult.severity} /></div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Nơi điều trị</p>
                    <p className="text-lg font-semibold mt-1">{treatmentSiteLabels[diagnoseResult.treatmentSite] ?? diagnoseResult.treatmentSite}</p>
                  </div>
                </div>
                {diagnoseResult.infectionProbabilities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Xác suất tác nhân gây bệnh</h3>
                    <div className="space-y-2">
                      {diagnoseResult.infectionProbabilities.map((item) => (
                        <div
                          key={item.pathogenId}
                          className="flex items-center justify-between border rounded-lg p-3"
                        >
                          <div>
                            <p className="font-medium text-sm">{item.pathogenName}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary">{(Number(item.probability) * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <footer className="flex justify-between border-t pt-4 -mt-6">
            <Button variant="outline" size="lg" onClick={handleReset}>
              Đặt lại
            </Button>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleDiagnose()}
                disabled={isDiagnosing || !selectedDiseaseId}
              >
                {isDiagnosing && <Loader2 className="animate-spin" />}
                {isDiagnosing ? "Đang xử lý..." : "Chẩn đoán"}
              </Button>
              <Button
                size="lg"
                onClick={() => handleDiagnoseAndRecommend()}
                disabled={isSending || !selectedDiseaseId}
              >
                {isSending && <Loader2 className="animate-spin" />}
                {isSending ? "Đang xử lý..." : "Gửi thông tin"}
              </Button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  )
}
