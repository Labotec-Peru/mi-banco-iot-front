// components/ComandoColumns.tsx
import { Button, Chip, Tooltip } from "@heroui/react";
import { Eye, RefreshCircle, CheckCircle, Xxx, ClockCircle, DangerTriangle } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Comando } from "../types/comando";

interface ComandoColumnsProps {
    onView?: (comando: Comando) => void;
    onUpdateStatus?: (comando: Comando, status: string) => void;
}

const statusColorMap: Record<string, { color: "success" | "warning" | "danger" | "default" | "secondary"; label: string; icon: any }> = {
    PENDING: { color: "warning", label: "Pendiente", icon: <ClockCircle size={14} /> },
    SENT: { color: "secondary", label: "Enviado", icon: <RefreshCircle size={14} /> },
    EXECUTED: { color: "success", label: "Ejecutado", icon: <CheckCircle size={14} /> },
    FAILED: { color: "danger", label: "Fallido", icon: <Xxx size={14} /> },
    CANCELLED: { color: "default", label: "Cancelado", icon: <DangerTriangle size={14} /> },
};

const priorityColorMap: Record<string, { color: "success" | "warning" | "danger" | "default"; label: string }> = {
    LOW: { color: "success", label: "Baja" },
    MEDIUM: { color: "warning", label: "Media" },
    HIGH: { color: "danger", label: "Alta" },
    CRITICAL: { color: "danger", label: "Crítica" },
};

export const getComandoColumns = ({
    onView,
    onUpdateStatus,
}: ComandoColumnsProps): CustomColumnDef<Comando>[] => [
    {
        key: "id",
        label: "ID",
        width: 80,
        sortable: true,
        render: (comando) => <span className="font-mono text-sm">#{comando.id}</span>,
    },
    {
        key: "waterMeterId",
        label: "MEDIDOR",
        width: 150,
        sortable: true,
        render: (comando) => (
            <span className="text-default-600">
                {comando.waterMeter?.serialNumber || comando.waterMeterId || "—"}
            </span>
        ),
    },
    {
        key: "type",
        label: "TIPO",
        width: 150,
        sortable: true,
        render: (comando) => (
            <Chip size="sm" variant="flat">
                {comando.type}
            </Chip>
        ),
    },
    {
        key: "status",
        label: "ESTADO",
        width: 140,
        sortable: true,
        render: (comando) => {
            const status = statusColorMap[comando.status] || statusColorMap.PENDING;
            return (
                <Chip color={status.color} size="sm" startContent={status.icon}>
                    {status.label}
                </Chip>
            );
        },
    },
    {
        key: "priority",
        label: "PRIORIDAD",
        width: 120,
        sortable: true,
        render: (comando) => {
            const priority = priorityColorMap[comando.priority || 'MEDIUM'];
            return (
                <Chip color={priority.color} size="sm" variant="flat">
                    {priority.label}
                </Chip>
            );
        },
    },
    {
        key: "retryCount",
        label: "REINTENTOS",
        width: 100,
        sortable: true,
        render: (comando) => (
            <span className="text-default-600">
                {comando.retryCount || 0}
            </span>
        ),
    },
    {
        key: "createdAt",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (comando) => (
            <span className="text-default-600 text-sm">
                {comando.createdAt ? new Date(comando.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : "—"}
            </span>
        ),
    },
    {
        key: "acciones",
        label: "ACCIONES",
        width: 120,
        sortable: false,
        align: "center",
        render: (comando) => (
            <div className="flex items-center justify-center gap-1">
                {onView && (
                    <Tooltip content="Ver" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => onView(comando)}
                        >
                            <Eye size={16} />
                        </Button>
                    </Tooltip>
                )}
                {onUpdateStatus && comando.status === 'PENDING' && (
                    <Tooltip content="Marcar como Enviado" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="secondary"
                            onPress={() => onUpdateStatus(comando, 'SENT')}
                        >
                            <RefreshCircle size={16} />
                        </Button>
                    </Tooltip>
                )}
                {onUpdateStatus && comando.status === 'SENT' && (
                    <Tooltip content="Marcar como Ejecutado" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="success"
                            onPress={() => onUpdateStatus(comando, 'EXECUTED')}
                        >
                            <CheckCircle size={16} />
                        </Button>
                    </Tooltip>
                )}
            </div>
        ),
    },
];