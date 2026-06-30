export interface AntibioticItem {
  id: string
  name: string
  antibioticSpectrum: {
    id: string
    name: string
    description: string
  }
  category: string
  routeOfAdministrations: string[]
  dosages: Record<string, string[]>
}

export interface PathogenItem {
  id: string
  name: string
  description: string
}

export interface DiseaseItem {
  id: string
  name: string
  description: string
}

export interface TreatmentProtocolItem {
  id: string
  name: string
  issuer: string
  issueDate: string
  version: number
  medicines: AntibioticItem[]
}
