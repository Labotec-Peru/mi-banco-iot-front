import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getCompanyFilters = (): FilterFieldDef[] => [
    {
        key: "search",
        type: "text",
        placeholder: "Buscar por nombre o email...",
    },
    {
        key: "status",
        type: "select",
        placeholder: "Todos los estados",
        options: [
            { value: "ACTIVE", label: "Activo" },
            { value: "INACTIVE", label: "Inactivo" },
            { value: "DELETED", label: "Eliminado" },
        ],
    },
];