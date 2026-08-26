export const API_ESTADO_CONFIG = {
    ACTIVE: { label: "Activo", color: "success" },
    INACTIVE: { label: "Inactivo", color: "default" },
    MAINTENANCE: { label: "Mantenimiento", color: "warning" },
    DISABLED: { label: "Deshabilitado", color: "danger" },
} as const;

export type MedidorStatus = keyof typeof API_ESTADO_CONFIG;

export const ESTADO_FILTER_OPTIONS = [
    { value: "ACTIVE", label: "Activo" },
    { value: "MAINTENANCE", label: "Mantenimiento" },
    { value: "INACTIVE", label: "Inactivo" },
    { value: "DISABLED", label: "Deshabilitado" },
];

export const ESTADO_SELECT_OPTIONS = [
    { value: "ACTIVE", label: "Activo" },
    { value: "INACTIVE", label: "Inactivo" },
    { value: "MAINTENANCE", label: "Mantenimiento" },
    { value: "DISABLED", label: "Deshabilitado" },
];