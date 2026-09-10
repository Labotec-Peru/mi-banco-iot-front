import type { FilterFieldDef } from "../../../components/ux/TableComponent";
export const getTipoFilters = (): FilterFieldDef[] => [
    {
        key: "search",
        type: "text",
        placeholder: "Buscar por nombre o abreviatura...",
    },
];