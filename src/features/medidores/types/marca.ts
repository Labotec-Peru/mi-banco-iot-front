export interface Marca {
    id: number;
    name: string;
    estado: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    manufacturerCompanyId: number;
}

export interface MarcaFilters {
    name?: string;
    page?: number;
    size?: number;
}