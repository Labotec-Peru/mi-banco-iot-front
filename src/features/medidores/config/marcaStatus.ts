export const API_MARCA_CONFIG = {
    ACTIVE: { label: "Activo", color: "success" },
    INACTIVE: { label: "Inactivo", color: "default" },
} as const;

export type MarcaStatus = keyof typeof API_MARCA_CONFIG;

export const MARCA_STATUS_FILTER_OPTIONS = [
    { value: "ACTIVE", label: "Activo" },
    { value: "INACTIVE", label: "Inactivo" },
];

export const MARCA_STATUS_SELECT_OPTIONS = [
    { value: "ACTIVE", label: "Activo" },
    { value: "INACTIVE", label: "Inactivo" },
];