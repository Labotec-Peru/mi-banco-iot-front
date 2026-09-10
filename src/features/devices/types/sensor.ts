export interface Sensor {
    id: number;
    serialNumber: string;
    meterBrandId: number;
    meterModelId: number;
    firmwareVersion?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    meterBrand?: {
        id: number;
        name: string;
    };
    meterModel?: {
        id: number;
        name: string;
    };
}

export interface CreateSensorRequest {
    serialNumber: string;
    meterBrandId: number;
    meterModelId: number;
    firmwareVersion?: string;
}

export interface UpdateSensorRequest {
    serialNumber?: string;
    meterBrandId?: number;
    meterModelId?: number;
    firmwareVersion?: string;
}

export interface SensorFilters {
    serialNumber?: string;
    meterBrandId?: number;
    meterModelId?: number;
    status?: string;
    page?: number;
    size?: number;
}