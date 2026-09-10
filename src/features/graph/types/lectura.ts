export interface Lectura {
    id: number;
    waterMeterId: number;
    value: number; 
    readingDate: string;
    consumption?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    obisCode?: string;
    flow?: number; 
    totalFlow?: number; 
    reverseFlow?: number; 
    values?: Array<{
        id: number;
        attributeName: string;
        value: string;
        recordedAt: string;
    }>;
    waterMeter?: {
        id: number;
        serialNumber: string;
        meterModel?: {
            id: number;
            name: string;
        };
        meterBrand?: {
            id: number;
            name: string;
        };
    };
}

export interface LecturaFilters {
    waterMeterId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface CreateLecturaRequest {
    waterMeterId: number;
    value: number;
    readingDate: string;
}