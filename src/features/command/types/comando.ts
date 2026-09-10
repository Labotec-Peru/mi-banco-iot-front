export interface Comando {
    id: number;
    waterMeterId: number;
    type: string;
    payload: Record<string, any>;
    status: 'PENDING' | 'SENT' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
    retryCount: number;
    createdAt?: string;
    updatedAt?: string;
    executedAt?: string;
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
    errorMessage?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface CreateComandoRequest {
    waterMeterId: number;
    type: string;
    payload: Record<string, any>;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface UpdateComandoStatusRequest {
    status: 'PENDING' | 'SENT' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
    errorMessage?: string;
}

export interface ComandoFilters {
    waterMeterId?: number;
    type?: string;
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}