import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getLecturaFilters = (): FilterFieldDef[] => {
    return [      
        {
            key: 'waterMeterId',
            type: 'select',
            placeholder: 'Seleccionar medidor',
            options: [], 
        },
        {
            key: 'dateRange',  
            type: 'dateRange',
            placeholder: 'Rango de fechas',
        },        
    ];
};