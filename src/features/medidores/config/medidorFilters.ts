import { ESTADO_FILTER_OPTIONS } from "./medidorStatus";

export const getMedidorFilters = () => [
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