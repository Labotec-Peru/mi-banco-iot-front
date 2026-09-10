export interface TecnologiaRed {
    id: number;
    name: string;
    abbreviation?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateTecnologiaRedRequest {
    name: string;
    abbreviation?: string;
}

export interface UpdateTecnologiaRedRequest {
    name?: string;
    abbreviation?: string;
}

export interface TecnologiaRedFilters {
    name?: string;
    abbreviation?: string;
    status?: string;
    page?: number;
    size?: number;
}