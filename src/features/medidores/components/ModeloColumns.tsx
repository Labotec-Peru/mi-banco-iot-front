import { Button, Chip, Tooltip } from "@heroui/react";
import { PenNewSquare, TrashBinTrash } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Modelo } from "../types/modelo";  

interface ModeloColumnsProps {
    onEdit: (modelo: Modelo) => void;  
    onDelete: (modelo: Modelo) => void;  
}

export const getModeloColumns = ({
    onEdit,
    onDelete,
}: ModeloColumnsProps): CustomColumnDef<Modelo>[] => [  
    {
        key: "id",
        label: "ID",
        width: 80,
        sortable: true,
        render: (modelo) => <span className="font-mono text-sm">{modelo.id}</span>,
    },
    {
        key: "name",
        label: "NOMBRE",
        width: 200,
        sortable: true,
        render: (modelo) => (
            <div className="flex items-center gap-2">
                <span className="font-semibold text-default-800">{modelo.name}</span>
            </div>
        ),
    },
    {
        key: "brandId", 
        label: "MARCA", 
        width: 200,
        sortable: true,
        render: (modelo) => (
            <span className="text-default-600">
                {modelo.brandName || modelo.brandId || (
                    <span className="text-default-400 text-sm italic">Sin marca</span>
                )}
            </span>
        ),
    },
    {
        key: "description",
        label: "DESCRIPCIÓN",
        width: 300,
        render: (modelo) => (
            <span className="text-default-600">
                {modelo.description || (
                    <span className="text-default-400 text-sm italic">Sin descripción</span>
                )}
            </span>
        ),
    },
    {
        key: "status",
        label: "ESTADO",
        width: 150,
        sortable: true,
        render: (modelo) => {
            const statusMap: Record<string, { color: "success" | "warning" | "danger" | "default"; label: string }> = {
                ACTIVE: { color: "success", label: "Activo" },
                INACTIVE: { color: "warning", label: "Inactivo" },
                DELETED: { color: "danger", label: "Eliminado" },
            };
            const status = statusMap[modelo.status || 'ACTIVE'] || { color: "default", label: modelo.status || "Activo" };
            return <Chip color={status.color} size="sm">{status.label}</Chip>;
        },
    },
    {
        key: "createdAt",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (modelo) => (
            <span className="text-default-600 text-sm">
                {modelo.createdAt ? new Date(modelo.createdAt).toLocaleDateString('es-ES', {
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
        render: (modelo) => (
            <div className="flex items-center justify-center gap-1">
                <Tooltip content="Editar" size="sm">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => onEdit(modelo)}
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
                        onPress={() => onDelete(modelo)}
                    >
                        <TrashBinTrash size={16} />
                    </Button>
                </Tooltip>
            </div>
        ),
    },
];