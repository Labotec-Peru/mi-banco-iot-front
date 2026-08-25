export type EstadoMedidor = "activo" | "pendiente" | "inactivo";

export type Medidor = {
  id: string;
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
  latitud: string;
  longitud: string;
  valorInicial: number;
  fechaInstalacion: string;
  estado: EstadoMedidor;
};

export const ESTADO_CONFIG: Record<
  EstadoMedidor,
  { label: string; color: "success" | "warning" | "default"; dot: string; glow: string; ring: string }
> = {
  activo: {
    label: "Activo",
    color: "success",
    dot: "bg-success-500",
    glow: "bg-success",
    ring: "ring-success/15",
  },
  pendiente: {
    label: "Pendiente de instalación",
    color: "warning",
    dot: "bg-warning-500",
    glow: "bg-warning",
    ring: "ring-warning/15",
  },
  inactivo: {
    label: "Inactivo",
    color: "default",
    dot: "bg-default-300",
    glow: "bg-default-400",
    ring: "ring-default-200/40",
  },
};