import { Chip, Button, Tooltip } from "@heroui/react";
import { ClockCircle, ShieldCheck, Cpu } from "@solar-icons/react";
import { ESTADO_SERIE_CONFIG, formatRelativeTime, type SerieEquipo } from "../types/serie";

type SerieCardProps = {
  serie: SerieEquipo;
  onViewHistory: (serie: SerieEquipo) => void;
};

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-default-400">{label}</p>
      <p className={`truncate text-xs font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function SerieCard({ serie, onViewHistory }: SerieCardProps) {
  const estado = ESTADO_SERIE_CONFIG[serie.estado];
  const garantiaVencida = serie.garantiaHasta ? new Date(serie.garantiaHasta).getTime() < Date.now() : false;

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-content1 p-4 shadow-sm ring-1 ring-default-100 transition-shadow hover:shadow-md">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${estado.glow} opacity-[0.06] blur-2xl transition-opacity group-hover:opacity-[0.1]`}
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-content2/60 ring-1 ${estado.ring} text-primary`}>
              <Cpu size={16} weight="BoldDuotone" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground font-mono">{serie.serie}</p>
              <p className="truncate text-[11px] text-default-400">{serie.marca} · {serie.modelo}</p>
            </div>
          </div>

          <Chip
            size="sm"
            variant="flat"
            color={estado.color}
            startContent={<span className={`ml-1.5 h-1.5 w-1.5 rounded-full ${estado.dot}`} />}
            classNames={{ base: "h-5 shrink-0", content: "px-1 text-[9px] font-semibold" }}
          >
            {estado.label}
          </Chip>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-2xl bg-content2/40 p-3">
          <Field label="Firmware" value={serie.firmware} mono />
          <Field label="Última conexión" value={formatRelativeTime(serie.ultimaConexion)} />
          <Field label="Proveedor" value={serie.proveedor} />
          <Field label="Medidor instalado" value={serie.medidorInstalado ?? "—"} mono />
        </div>

        <div className="flex items-center justify-between border-t border-divider/60 pt-3">
          <div className={`flex items-center gap-1.5 text-[11px] ${garantiaVencida ? "text-danger" : "text-default-500"}`}>
            <ShieldCheck size={13} className={garantiaVencida ? "text-danger" : "text-default-300"} />
            <span>
              {serie.garantiaHasta
                ? `Garantía ${garantiaVencida ? "vencida" : "hasta"} ${new Date(serie.garantiaHasta).toLocaleDateString("es-PE")}`
                : "Sin garantía registrada"}
            </span>
          </div>

          <Tooltip content="Ver historial" size="sm">
            <Button isIconOnly size="sm" variant="light" onPress={() => onViewHistory(serie)}>
              <ClockCircle size={16} className="text-default-500" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}