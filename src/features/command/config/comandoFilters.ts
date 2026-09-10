// En comandoFilters.ts
import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getComandoFilters = (): FilterFieldDef[] => [
    {
        key: "search", 
        type: "text",
        placeholder: "Buscar por medidor, tipo o ID...",
    },
    {
        key: "type", 
        type: "select",
        placeholder: "Todos",
        options: [
            { value: "", label: "Todos" },
            { value: "READ", label: "Lectura" },
            { value: "CONFIGURE", label: "Configurar" },
            { value: "RESTART", label: "Reiniciar" },
            { value: "UPDATE_FIRMWARE", label: "Actualizar Firmware" },
            { value: "SET_PARAMETER", label: "Establecer Parámetro" },
            { value: "GET_PARAMETER", label: "Obtener Parámetro" },
        ],
    },
    {
        key: "status",
        type: "select",
        placeholder: "Todos",
        options: [
            { value: "", label: "Todos" },
            { value: "PENDING", label: "Pendiente" },
            { value: "SENT", label: "Enviado" },
            { value: "EXECUTED", label: "Ejecutado" },
            { value: "FAILED", label: "Fallido" },
            { value: "CANCELLED", label: "Cancelado" },
        ],
    },
    {
        key: "priority", 
        type: "select",
        placeholder: "Todas",
        options: [
            { value: "", label: "Todas" },
            { value: "LOW", label: "Baja" },
            { value: "MEDIUM", label: "Media" },
            { value: "HIGH", label: "Alta" },
            { value: "CRITICAL", label: "Crítica" },
        ],
    },
    {
        key: "startDate",  
        type: "date",
        placeholder: "Fecha inicio",
    },
    {
        key: "endDate",  
        type: "date",
        placeholder: "Fecha fin",
    },
];