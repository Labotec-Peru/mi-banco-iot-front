import { Button, Chip, Tooltip } from "@heroui/react";
import { PenNewSquare, TrashBinTrash } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Company } from "../types/company";
import { formatDate } from "@/utils/date";

interface CompanyColumnsProps {
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

export const getCompanyColumns = ({
    onEdit,
    onDelete,
}: CompanyColumnsProps): CustomColumnDef<Company>[] => [
        {
            key: "id",
            label: "ID",
            width: 70,
            sortable: true,
            render: (company) => <span className="font-mono text-sm">{company.id}</span>,
        },
        {
            key: "name",
            label: "NOMBRE",
            width: 200,
            sortable: true,
            render: (company) => (
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-default-800">{company.name}</span>
                </div>
            ),
        },
        {
            key: "tenantAccess",  
            label: "Acceso Tenant",
            sortable: true,
            width: 150,
            render: (company) => (
                <span className="text-default-600">
                    {company.tenantAccess || (
                        <span className="text-default-400 text-sm italic">—</span>
                    )}
                </span>
            ),
        },
        {
            key: "email",
            label: "EMAIL",
            width: 180,
            render: (company) => (
                <span className="text-default-600">
                    {company.email || (
                        <span className="text-default-400 text-sm italic">Sin email</span>
                    )}
                </span>
            ),
        },
        {
            key: "phone",
            label: "TELÉFONO",
            width: 130,
            render: (company) => (
                <span className="text-default-600">
                    {company.phone || (
                        <span className="text-default-400 text-sm italic">Sin teléfono</span>
                    )}
                </span>
            ),
        },
        {
            key: "taxIdentifierValue",
            label: "RUC/NIT",
            width: 120,
            render: (company) => (
                <span className="font-mono text-sm text-default-600">
                    {company.taxIdentifierValue || "-"}
                </span>
            ),
        },
        {
            key: "status",
            label: "ESTADO",
            width: 110,
            align: "center",
            render: (company) => {
                const statusColors = {
                    ACTIVE: "success",
                    INACTIVE: "default",
                    DELETED: "danger",
                } as const;
                const statusLabels = {
                    ACTIVE: "Activo",
                    INACTIVE: "Inactivo",
                    DELETED: "Eliminado",
                } as const;
                return (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={statusColors[company.status as keyof typeof statusColors] || "default"}
                        classNames={{ content: "text-[11px] font-medium" }}
                    >
                        {statusLabels[company.status as keyof typeof statusLabels] || company.status}
                    </Chip>
                );
            },
        },
        {
            key: "created",
            label: "CREADO",
            width: 160,
            sortable: true,
            render: (company) => (
                <span className="text-sm text-default-600">
                    {formatDate(company.created, false)}
                </span>
            ),
        },
        {
            key: "acciones",
            label: "ACCIONES",
            width: 90,
            sortable: false,
            align: "center",
            render: (company) => (
                <div className="flex items-center justify-center gap-1">
                    <Tooltip content="Editar" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => onEdit(company)}
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
                            onPress={() => onDelete(company)}
                        >
                            <TrashBinTrash size={16} />
                        </Button>
                    </Tooltip>
                </div>
            ),
        },
    ];