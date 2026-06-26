/**
 * Create antibiotic spectrum request DTO
 */
export interface CreateAntibioticSpectrumRequest {
    name: string;
    description: string;
}

/**
 * Create antibiotic spectrum response DTO
 */
export interface CreateAntibioticSpectrumResult {
    id: string;
}

/**
 * Get paged antibiotic spectrum list response DTO
 */
export interface AntibioticSpectrumItem {
    id: string;
    name: string;
    description: string;
}

/**
 * Update antibiotic spectrum request DTO
 */
export interface UpdateAntibioticSpectrumRequest {
    id: string;
    name: string;
    description: string;
}