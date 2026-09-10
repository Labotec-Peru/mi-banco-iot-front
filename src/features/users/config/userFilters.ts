import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getUserFilters = (): FilterFieldDef[] => [
    {
        key: "search",
        type: "text",
        placeholder: "Buscar por nombre, email o documento...",
    },
    {
        key: "status",
        type: "select",
        placeholder: "Todos los estados",
        options: [
            { value: "", label: "Todos los estados" },
            { value: "ACTIVE", label: "Activo" },
            { value: "INACTIVE", label: "Inactivo" },
            { value: "PENDING", label: "Pendiente" },
            { value: "BLOCKED", label: "Bloqueado" },
        ],
    },
    {
        key: "role",
        type: "select",
        placeholder: "Todos los roles",
        options: [
            { value: "", label: "Todos los roles" },
            { value: "SUPER_ADMIN", label: "Super Admin" },
            { value: "ADMIN", label: "Admin" },
            { value: "USER", label: "Usuario" },
            { value: "VIEWER", label: "Visor" },
        ],
    },
];