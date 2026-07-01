export interface StatisticsData {
    totalDecision: { severity: string; count: number }[];
    recommendationAccuracy: { month: number; accuracy: number }[];
    antibioticConsumptionRates: { category: string; count: number; rate: number }[];
}