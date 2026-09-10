// components/TecnologiaRedColumns.tsx
import { Button, Chip, Tooltip } from "@heroui/react";
import { PenNewSquare, TrashBinTrash } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { TecnologiaRed } from "../types/tecnologiaRed";

interface TecnologiaRedColumnsProps {
    onEdit: (tecnologia: TecnologiaRed) => void;
    onDelete: (tecnologia: TecnologiaRed) => void;
}

export const getTecnologiaRedColumns = ({
    onEdit,
    onDelete,
}: TecnologiaRedColumnsProps): CustomColumnDef<TecnologiaRed>[] => [
    {
        key: "id",
        label: "ID",
        width: 80,
        sortable: true,
        render: (tecnologia) => <span className="font-mono text-sm">{tecnologia.id}</span>,
    },
    {
        key: "name",
        label: "NOMBRE",
        width: 250,
        sortable: true,
        render: (tecnologia) => (
            <div className="flex items-center gap-2">
                <span className="font-semibold text-default-800">{tecnologia.name}</span>
            </div>
        ),
    },
    {
        key: "abbreviation",
        label: "ABREVIATURA",
        width: 150,
        sortable: true,
        render: (tecnologia) => (
            <span className="text-default-600">
                {tecnologia.abbreviation || (
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
        render: (tecnologia) => {
            const statusMap: Record<string, { color: "success" | "warning" | "danger" | "default"; label: string }> = {
                ACTIVE: { color: "success", label: "Activo" },
                INACTIVE: { color: "warning", label: "Inactivo" },
                DELETED: { color: "danger", label: "Eliminado" },
            };
            const status = statusMap[tecnologia.status || 'ACTIVE'] || { color: "default", label: tecnologia.status || "Activo" };
            return <Chip color={status.color} size="sm">{status.label}</Chip>;
        },
    },
    {
        key: "createdAt",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (tecnologia) => (
            <span className="text-default-600 text-sm">
                {tecnologia.createdAt ? new Date(tecnologia.createdAt).toLocaleDateString('es-ES', {
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
        render: (tecnologia) => (
            <div className="flex items-center justify-center gap-1">
                <Tooltip content="Editar" size="sm">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onEdit(tecnologia)}
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
                        onPress={() => onDelete(tecnologia)}
                    >
                        <TrashBinTrash size={16} />
                    </Button>
                </Tooltip>
            </div>
        ),
    },
];