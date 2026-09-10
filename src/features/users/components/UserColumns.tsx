import { Button, Chip, Tooltip, Avatar } from "@heroui/react";
import { Eye, Pen2, TrashBinTrash } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { User } from "../services/userApi";

interface UserColumnsProps {
    onView?: (user: User) => void;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
}

export const getUserColumns = ({
    onView,
    onEdit,
    onDelete,
}: UserColumnsProps): CustomColumnDef<User>[] => [
    {
        key: "user",
        label: "USUARIO",
        width: 200,
        sortable: false,
        render: (user) => (
            <div className="flex items-center gap-2">
                <Avatar
                    src={user.imageUrl}
                    size="sm"
                    name={`${user.firstName} ${user.lastName}`}
                />
                <div>
                    <div className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-default-400">{user.email}</div>
                </div>
            </div>
        ),
    },
    {
        key: "documentNumber",
        label: "DOCUMENTO",
        width: 130,
        sortable: true,
        render: (user) => (
            <span className="text-sm">
                {user.documentNumber || "—"}
            </span>
        ),
    },
    {
        key: "phone",
        label: "TELÉFONO",
        width: 130,
        sortable: false,
        render: (user) => (
            <span className="text-sm text-default-600">
                {user.phone || "—"}
            </span>
        ),
    },
    {
        key: "roles",
        label: "ROLES",
        width: 150,
        sortable: false,
        render: (user) => (
            <div className="flex flex-wrap gap-1">
                {user.roles?.slice(0, 2).map((role) => (
                    <Chip key={role} size="sm" variant="flat" color="primary">
                        {role.replace('_', ' ')}
                    </Chip>
                ))}
                {user.roles && user.roles.length > 2 && (
                    <Chip size="sm" variant="flat">
                        +{user.roles.length - 2}
                    </Chip>
                )}
            </div>
        ),
    },
    {
        key: "status",
        label: "ESTADO",
        width: 120,
        sortable: true,
        render: (user) => {
            const statusMap: Record<string, { color: "success" | "warning" | "danger" | "default"; label: string }> = {
                ACTIVE: { color: "success", label: "Activo" },
                INACTIVE: { color: "warning", label: "Inactivo" },
                PENDING: { color: "warning", label: "Pendiente" },
                BLOCKED: { color: "danger", label: "Bloqueado" },
            };
            const status = statusMap[user.status || 'ACTIVE'] || { color: "default", label: user.status || "Activo" };
            return <Chip color={status.color} size="sm">{status.label}</Chip>;
        },
    },
    {
        key: "created",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (user) => (
            <span className="text-default-600 text-sm">
                {user.created ? new Date(user.created).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
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
        render: (user) => (
            <div className="flex items-center justify-center gap-1">
                {onView && (
                    <Tooltip content="Ver" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => onView(user)}
                        >
                            <Eye size={16} />
                        </Button>
                    </Tooltip>
                )}
                {onEdit && (
                    <Tooltip content="Editar" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="warning"
                            onPress={() => onEdit(user)}
                        >
                            <Pen2 size={16} />
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
                            onPress={() => onDelete(user)}
                        >
                            <TrashBinTrash size={16} />
                        </Button>
                    </Tooltip>
                )}
            </div>
        ),
    },
];