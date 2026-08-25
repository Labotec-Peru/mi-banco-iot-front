import { Chip, Button, Tooltip } from "@heroui/react";
import { PenNewSquare, TrashBinTrash, MapPoint, Waterdrop } from "@solar-icons/react";
import { ESTADO_CONFIG, type Medidor } from "../types/medidor";


type MedidorCardProps = {
  medidor: Medidor;
  onEdit: (medidor: Medidor) => void;
  onDelete: (medidor: Medidor) => void;
};

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-default-400">{label}</p>
      <p className={`truncate text-xs font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

export default function MedidorCard({ medidor, onEdit, onDelete }: MedidorCardProps) {
  const estado = ESTADO_CONFIG[medidor.estado];

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-content1 p-4 shadow-sm ring-1 ring-default-100 transition-shadow hover:shadow-md">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${estado.glow} opacity-[0.06] blur-2xl transition-opacity group-hover:opacity-[0.1]`}
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-content2/60 ring-1 ${estado.ring} text-primary`}>
              <Waterdrop size={16} weight="BoldDuotone" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{medidor.numeroSerie}</p>
              <p className="truncate text-[11px] text-default-400">{medidor.codigoPod}</p>
            </div>
          </div>

          <Chip
            size="sm"
            variant="flat"
            color={estado.color}
            classNames={{ base: "h-5 shrink-0", content: "px-1.5 text-[9px] font-semibold" }}
          >
            {estado.label}
          </Chip>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-2xl bg-content2/40 p-3">
          <Field label="IMEI" value={medidor.imei} mono />
          <Field label="Tecnología" value={medidor.tecnologiaRed} />
          <Field label="Marca" value={medidor.marca} />
          <Field label="Modelo" value={medidor.modelo} />
        </div>

        <div className="border-t border-dashed border-divider/60" />

        <div className="flex flex-col gap-2">
          <Field label="Empresa Cliente" value={medidor.empresaCliente} />
          <Field label="Empresa Proveedora" value={medidor.empresaProveedora} />

          <div className="flex items-start gap-1.5 pt-0.5">
            <MapPoint size={13} className="mt-0.5 shrink-0 text-default-300" />
            <p className="truncate text-xs text-default-500">{medidor.direccion}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-divider/60 pt-3">
          <div className="flex items-center gap-3 text-[11px] text-default-500">
            <span>
              <span className="font-semibold text-foreground tabular-nums">{medidor.valorInicial} L</span> inicial
            </span>
            <span className="h-3 w-px bg-divider" />
            <span>{new Date(medidor.fechaInstalacion).toLocaleDateString("es-PE")}</span>
          </div>

          <div className="flex items-center gap-1">
            <Tooltip content="Editar" size="sm">
              <Button isIconOnly size="sm" variant="light" onPress={() => onEdit(medidor)}>
                <PenNewSquare size={14} className="text-default-500" />
              </Button>
            </Tooltip>
            <Tooltip content="Eliminar" size="sm" color="danger">
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => onDelete(medidor)}>
                <TrashBinTrash size={14} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}