import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getSensorFilters = (): FilterFieldDef[] => [
     {
            key: "search",
            type: "text",
            placeholder: "Buscar por número de serie o firmware...",
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