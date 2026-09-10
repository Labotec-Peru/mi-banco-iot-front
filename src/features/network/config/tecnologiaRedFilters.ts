import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getTecnologiaRedFilters = (): FilterFieldDef[] => [
    {
        key: "search",
        type: "text",
        placeholder: "Buscar por nombre de marca...",
    },
    {
            key: "status",
            type: "select",
            placeholder: "Todos",
            options: [
                { value: "", label: "Todos" },
                { value: "ACTIVE", label: "Activo" },
                { value: "INACTIVE", label: "Inactivo" },
                { value: "DELETED", label: "Eliminado" },
            ],
        },
];