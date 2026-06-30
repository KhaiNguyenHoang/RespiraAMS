export interface SavedDiagnose {
  id: string
  timestamp: string
  patientName: string
  diseaseName: string
  severity: string
  treatmentSite: string
  selectedProtocolId: string
  selectedProtocolName: string
  reason?: string
}

const STORAGE_KEY = "doctor_diagnose_history"

export function getHistory(): SavedDiagnose[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveDiagnose(record: SavedDiagnose): void {
  const history = getHistory()
  history.unshift(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
