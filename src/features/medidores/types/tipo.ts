export interface Tipo {
    id: number;
    name: string;
    abbreviation?: string;
    description?: string;
    code?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTipoRequest {
    name: string;
    abbreviation?: string;
}

export interface UpdateTipoRequest {
    name?: string;
    abbreviation?: string;
}

export interface TipoFilters {
    name?: string;
    abbreviation?: string;
    status?: string;
    page?: number;
    size?: number;
}