import { Button, Tooltip } from "@heroui/react";
import { PenNewSquare, TrashBinTrash } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Marca } from "../types/marca";

interface MarcaColumnsProps {
    onEdit: (marca: Marca) => void;
    onDelete: (marca: Marca) => void;
}

export const getMarcaColumns = ({
    onEdit,
    onDelete,
}: MarcaColumnsProps): CustomColumnDef<Marca>[] => [
        {
            key: "id",
            label: "ID",
            width: 80,
            sortable: true,
            render: (marca) => <span className="font-mono text-sm">{marca.id}</span>,
        },
        {
            key: "name",
            label: "NOMBRE",
            width: 200,
            sortable: true,
            render: (marca) => (
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-default-800">{marca.name}</span>
                </div>
            ),
        },
        {
            key: "description",
            label: "DESCRIPCIÓN",
            width: 300,
            render: (marca) => (
                <span className="text-default-600">
                    {marca.description || (
                        <span className="text-default-400 text-sm italic">Sin descripción</span>
                    )}
                </span>
            ),
        },
        {
            key: "status",
            label: "Estado",
            width: 180,
            sortable: false,
        },        
        {
            key: "acciones",
            label: "ACCIONES",
            width: 90,
            sortable: false,
            align: "center",
            render: (marca) => (
                <div className="flex items-center justify-center gap-1">
                    <Tooltip content="Editar" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => onEdit(marca)}
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
                            onPress={() => onDelete(marca)}
                        >
                            <TrashBinTrash size={16} />
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];