import { Button, Chip, Tooltip } from "@heroui/react";
import { PenNewSquare, TrashBinTrash } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Tipo } from "../types/tipo";

interface TipoColumnsProps {
    onEdit: (tipo: Tipo) => void;
    onDelete: (tipo: Tipo) => void;
}

export const getTipoColumns = ({
    onEdit,
    onDelete,
}: TipoColumnsProps): CustomColumnDef<Tipo>[] => [
    {
        key: "id",
        label: "ID",
        width: 80,
        sortable: true,
        render: (tipo) => <span className="font-mono text-sm">{tipo.id}</span>,
    },
    {
        key: "name",
        label: "NOMBRE",
        width: 250,
        sortable: true,
        render: (tipo) => (
            <div className="flex items-center gap-2">
                <span className="font-semibold text-default-800">{tipo.name}</span>
            </div>
        ),
    },
    {
        key: "abbreviation",
        label: "ABREVIATURA",
        width: 150,
        sortable: true,
        render: (tipo) => (
            <span className="text-default-600">
                {tipo.abbreviation || (
                    <span className="text-default-400 text-sm italic">Sin abreviatura</span>
                )}
            </span>
        ),
    },
    {
        key: "status",
        label: "ESTADO",
        width: 150,
        sortable: true,
        render: (tipo) => {
            const statusMap: Record<string, { color: "success" | "warning" | "danger" | "default"; label: string }> = {
                ACTIVE: { color: "success", label: "Activo" },
                INACTIVE: { color: "warning", label: "Inactivo" },
                DELETED: { color: "danger", label: "Eliminado" },
            };
            const status = statusMap[tipo.status || 'ACTIVE'] || { color: "default", label: tipo.status || "Activo" };
            return <Chip color={status.color} size="sm">{status.label}</Chip>;
        },
    },
    {
        key: "createdAt",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (tipo) => (
            <span className="text-default-600 text-sm">
                {tipo.createdAt ? new Date(tipo.createdAt).toLocaleDateString('es-ES', {
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
        render: (tipo) => (
            <div className="flex items-center justify-center gap-1">
                <Tooltip content="Editar" size="sm">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onEdit(tipo)}
                    >
                        <PenNewSquare size={16} className="text-default-500" />
                    </Button>
                </Tooltip>
                <Tooltip content="Eliminar" size="sm" color="danger">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => onDelete(tipo)}
                    >
                        <TrashBinTrash size={16} />
                    </Button>
                </Tooltip>
            </div>
        ),
    },
];