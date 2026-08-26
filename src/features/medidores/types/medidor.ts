export type EstadoMedidor =
    | "ACTIVE"
    | "INACTIVE"
    | "MAINTENANCE"
    | "DISABLED";

export interface Medidor {
    id: number;
    uuid: string;
    numeroSerie: string;
    codigoPod: string;
    imei: string;
    marca: string;
    modelo: string;
    tipoMedidor: string;
    tecnologiaRed: string;
    empresaCliente: string;
    empresaProveedora: string;
    direccion: string;
    latitud: number;
    longitud: number;
    valorInicial: number;
    fechaInstalacion: string;
    estado: EstadoMedidor;
    consumo: number;
    isIntegrated: boolean;
    ubigeoCode: string;
    created: string;
    updated: string;
}

export const ESTADO_CONFIG: Record<
    EstadoMedidor,
    {
        label: string;
        color: "success" | "warning" | "default" | "danger";
        dot: string;
        glow: string;
        ring: string;
    }
> = {
    ACTIVE: {
        label: "Activo",
        color: "success",
        dot: "bg-success-500",
        glow: "bg-success",
        ring: "ring-success/15",
    },

    INACTIVE: {
        label: "Inactivo",
        color: "default",
        dot: "bg-default-300",
        glow: "bg-default-400",
        ring: "ring-default-200/40",
    },

    MAINTENANCE: {
        label: "Mantenimiento",
        color: "warning",
        dot: "bg-warning-500",
        glow: "bg-warning",
        ring: "ring-warning/15",
    },

    DISABLED: {
        label: "Deshabilitado",
        color: "danger",
        dot: "bg-danger-500",
        glow: "bg-danger",
        ring: "ring-danger/15",
    },
};