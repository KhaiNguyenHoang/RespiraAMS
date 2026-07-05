import { z } from "zod"

export const clinicalFormSchema = z.object({
  patientName: z.string(),
  dateOfBirth: z.string(),
  gender: z.string(),
  confusion: z.boolean(),
  age65: z.boolean(),
  urea: z.string(),
  respiratory: z.string(),
  systolic: z.string(),
  diastolic: z.string(),
  icuCriteria: z.record(z.string(), z.boolean()),
  icuNumericValues: z.record(z.string(), z.string()),
  resistanceRisks: z.record(z.string(), z.boolean()),
  resistanceNumericValues: z.record(z.string(), z.string()),
})

export type ClinicalFormValues = z.infer<typeof clinicalFormSchema>

export const defaultClinicalFormValues: ClinicalFormValues = {
  patientName: "",
  dateOfBirth: "",
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
}
