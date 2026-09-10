export interface WaterMeter {
    id: number;
    uuid: string;
    serialNumber: string;
    podCode: string;
    imei: string;
    meterModelId: number;
    meterBrandId: number;
    meterTypeId: number;
    clientCompanyId: number;
    providerCompanyId: number;
    networkTechnologyId: number;
    latitude: number;
    longitude: number;
    installationAddress: string;
    ubigeoCode: string;
    initialValue: number;
    lastValue: number;
    consumption: number;
    isIntegrated: boolean;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DISABLED';
    installationDate: string;
    created: string;
    updated: string;
}

export interface WaterMeterFilters {
    serialNumber?: string;
    podCode?: string;
    clientCompanyId?: number;
    providerCompanyId?: number;
    meterTypeId?: number;
    page?: number;
    size?: number;
}

export interface WaterMeterResponse {
    content: WaterMeter[];
    totalPages?: number;
    totalElements?: number;
    size?: number;
    number?: number;
    sort?: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

export interface CreateWaterMeterRequest {
    serialNumber: string;
    podCode: string;
    imei: string;
    meterModelId: number;
    meterBrandId: number;
    meterTypeId: number;
    clientCompanyId: number;
    providerCompanyId: number;
    networkTechnologyId: number;
    latitude: number;
    longitude: number;
    installationAddress: string;
    ubigeoCode: string;
    initialValue: number;
    installationDate: string;
    connectionType: string    
}

export interface UpdateWaterMeterRequest {
    serialNumber?: string;
    podCode?: string;
    imei?: string;
    meterModelId?: number;
    meterBrandId?: number;
    meterTypeId?: number;
    clientCompanyId?: number;
    providerCompanyId?: number;
    networkTechnologyId?: number;
    latitude?: number;
    longitude?: number;
    installationAddress?: string;
    ubigeoCode?: string;
    initialValue?: number;
    installationDate?: string;
    connectionType: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DISABLED';
}