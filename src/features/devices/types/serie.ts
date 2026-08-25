export type EstadoSerie = "instalado" | "con_falla" | "en_stock" | "retirado";

export type SerieEquipo = {
  id: string;
  serie: string;
  marca: string;
  modelo: string;
  firmware: string;
  ultimaConexion: string | null; // ISO date, null si nunca conectó
  estado: EstadoSerie;
  medidorInstalado: string | null; // código del medidor vinculado
  proveedor: string;
  garantiaHasta: string | null; // ISO date
};

export const ESTADO_SERIE_CONFIG: Record<
  EstadoSerie,
  { label: string; color: "success" | "danger" | "warning" | "default"; dot: string; glow: string; ring: string }
> = {

    
  instalado: {
    label: "Instalado",
    color: "success",
    dot: "bg-success-500",
    glow: "bg-success",
    ring: "ring-success/15",
  },
  con_falla: {
    label: "Con falla",
    color: "danger",
    dot: "bg-danger-500",
    glow: "bg-danger",
    ring: "ring-danger/15",
  },
  en_stock: {
    label: "En stock",
    color: "default",
    dot: "bg-default-400",
    glow: "bg-default-400",
    ring: "ring-default-200/40",
  },
  retirado: {
    label: "Retirado",
    color: "warning",
    dot: "bg-warning-400",
    glow: "bg-warning",
    ring: "ring-warning/15",
  },
};

export function formatRelativeTime(iso: string | null): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "Justo ahora";
  if (min < 60) return `Hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days} día${days > 1 ? "s" : ""}`;
}