import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getModeloFilters = (): FilterFieldDef[] => [
    {
        key: "search",
        type: "text",
        placeholder: "Buscar por nombre de modelos...",
    },
];