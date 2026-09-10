import { Button, Chip, Tooltip } from "@heroui/react";
import { TrashBinTrash, Eye } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Lectura } from "../types/lectura";

interface LecturaColumnsProps {
    onView?: (lectura: Lectura) => void;
    onDelete?: (lectura: Lectura) => void;
}

export const getLecturaColumns = ({
    onView,
    onDelete,
}: LecturaColumnsProps): CustomColumnDef<Lectura>[] => [
    {
        key: "id",
        label: "ID",
        width: 80,
        sortable: true,
        render: (lectura) => <span className="font-mono text-sm">{lectura.id}</span>,
    },
    {
        key: "title",
        label: "TÍTULO",
        width: 200,
        sortable: true,
        render: (lectura) => (
            <span className="text-default-600">
                {lectura.title || "—"}
            </span>
        ),
    },
    {
        key: "obisCode",
        label: "OBIS CODE",
        width: 120,
        sortable: true,
        render: (lectura) => (
            <span className="font-mono text-sm text-default-500">
                {lectura.obisCode || "—"}
            </span>
        ),
    },
    {
        key: "waterMeterId",
        label: "MEDIDOR",
        width: 150,
        sortable: true,
        render: (lectura) => (
            <span className="text-default-600">
                {lectura.waterMeter?.serialNumber || lectura.waterMeterId || "—"}
            </span>
        ),
    },
    {
        key: "value",
        label: "VALOR (m³)",
        width: 150,
        sortable: true,
        render: (lectura) => (
            <span className="font-semibold text-primary">
                {lectura.value} m³
            </span>
        ),
    },
    {
        key: "readingDate",
        label: "FECHA LECTURA",
        width: 180,
        sortable: true,
        render: (lectura) => (
            <span className="text-default-600 text-sm">
                {new Date(lectura.readingDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        ),
    },
    {
        key: "status",
        label: "ESTADO",
        width: 120,
        sortable: true,
        render: (lectura) => {
            const statusMap: Record<string, { color: "success" | "warning" | "danger" | "default"; label: string }> = {
                ACTIVE: { color: "success", label: "Activo" },
                INACTIVE: { color: "warning", label: "Inactivo" },
                DELETED: { color: "danger", label: "Eliminado" },
                PENDING: { color: "warning", label: "Pendiente" },
                VERIFIED: { color: "success", label: "Verificado" },
            };
            const status = statusMap[lectura.status || 'ACTIVE'] || { color: "default", label: lectura.status || "Activo" };
            return <Chip color={status.color} size="sm">{status.label}</Chip>;
        },
    },
    {
        key: "createdAt",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (lectura) => (
            <span className="text-default-600 text-sm">
                {lectura.createdAt ? new Date(lectura.createdAt).toLocaleDateString('es-ES', {
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
        width: 90,
        sortable: false,
        align: "center",
        render: (lectura) => (
            <div className="flex items-center justify-center gap-1">
                {onView && (
                    <Tooltip content="Ver" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => onView(lectura)}
                        >
                            <Eye size={16} />
                        </Button>
                    </Tooltip>
                )}
                {onDelete && (
                    <Tooltip content="Eliminar" size="sm" color="danger">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => onDelete(lectura)}
                        >
                            <TrashBinTrash size={16} />
                        </Button>
                    </Tooltip>
                )}
            </div>
        ),
    },
];