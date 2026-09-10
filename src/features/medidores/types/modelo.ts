export interface Modelo {
    brandId: any;
    brandName: any;
    id: number;
    name: string;
    description?: string;
    meterBrandId: number;
    meterBrandName?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;    
}

export interface CreateModeloRequest {
    name: string;
    description?: string;
    meterBrandId: number;
}

export interface UpdateModeloRequest {
    name?: string;
    description?: string;
    meterBrandId?: number;
}

export interface ModeloFilters {
    name?: string;
    meterBrandId?: number;
    status?: string;
    page?: number;
    size?: number;
}