import { ESTADO_FILTER_OPTIONS } from "./medidorStatus";
import type { FilterFieldDef } from "@/components/ux/TableComponent";

export const getMedidorFilters = (): FilterFieldDef[] => [
    { 
        key: "search", 
        type: "text" as const, 
        placeholder: "Buscar por serie, POD o cliente" 
    },
    {
        key: "tipoMedidor",
        type: "select" as const,
        placeholder: "Tipo",
        options: [{ value: "Agua", label: "Agua" }],
    },
    {
        key: "estado",
        type: "select" as const,
        placeholder: "Estado",
        options: ESTADO_FILTER_OPTIONS,
    },
];