// src/features/medidores/config/medidorColumns.tsx

import { Chip, Tooltip, Button } from "@heroui/react";
import { PenNewSquare, TrashBinTrash } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Medidor } from "../types/medidor";
import { API_ESTADO_CONFIG } from "../config/medidorStatus";

interface MedidorColumnsProps {
    onEdit: (medidor: Medidor) => void;
    onDelete: (medidor: Medidor) => void;
}

export const getMedidorColumns = ({
    onEdit,
    onDelete,
}: MedidorColumnsProps): CustomColumnDef<Medidor>[] => [
    {
        key: "numeroSerie",
        label: "N° Serie",
        width: 130,
        sticky: true,
        render: (m) => <span className="font-semibold">{m.numeroSerie}</span>,
    },
    { 
        key: "codigoPod", 
        label: "Código POD", 
        width: 120 
    },
    { 
        key: "imei", 
        label: "IMEI", 
        width: 150 
    },
    { 
        key: "marca", 
        label: "Marca", 
        width: 150 
    },
    { 
        key: "modelo", 
        label: "Modelo", 
        width: 110 
    },
    { 
        key: "tipoMedidor", 
        label: "Tipo", 
        width: 90 
    },
    { 
        key: "tecnologiaRed", 
        label: "Tecnología", 
        width: 100 
    },
    { 
        key: "empresaCliente", 
        label: "Empresa Cliente", 
        width: 180 
    },
    { 
        key: "empresaProveedora", 
        label: "Empresa Proveedora", 
        width: 160 
    },
    { 
        key: "direccion", 
        label: "Dirección", 
        width: 240 
    },
    {
        key: "fechaInstalacion",
        label: "Fecha Instalación",
        width: 130,
        render: (m) => new Date(m.fechaInstalacion).toLocaleDateString("es-PE"),
    },
    {
        key: "estado",
        label: "Estado",
        width: 170,
        align: "center",
        render: (m) => (
            <Chip 
                size="sm" 
                variant="flat" 
                color={API_ESTADO_CONFIG[m.estado]?.color || "default"}
                classNames={{ content: "text-[11px] font-medium" }}
            >
                {API_ESTADO_CONFIG[m.estado]?.label || m.estado}
            </Chip>
        ),
    },
    {
        key: "acciones",
        label: "Acciones",
        width: 90,
        sortable: false,
        align: "center",
        render: (m) => (
            <div className="flex items-center justify-center gap-1">
                <Tooltip content="Editar" size="sm">
                    <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light" 
                        onPress={() => onEdit(m)}
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
                        onPress={() => onDelete(m)}
                    >
                        <TrashBinTrash size={16} />
                    </Button>
                </Tooltip>
            </div>
        ),
    },
];