// NeverasTabla.tsx
import { useState, useMemo, useEffect } from "react";
import TableComponent, {
    type CustomColumnDef,
    type ColumnGroupDef,
    type FilterFieldDef,
} from "../../../components/ux/TableComponent";
import { useGetNeverasDashboardQuery, useGetContadorRegistrosPaginasQuery } from "../services/mapApi";
import type { NeveraDashboardItem } from "../services/mapApi";
import { ESTADO_OPTIONS_TABLE, ESTADOS_NEVERA } from "../services/estadoNeveraConstants";
import { useNeveraFilterContext } from "../contexts/NeveraFilterContext";

const PAGE_SIZE_DEFAULT = 15;

interface NeverasTablaProps {
    externalFilter?: string;
    onClearExternalFilter?: () => void;
}

export default function NeverasTabla({
    externalFilter,
    onClearExternalFilter
}: NeverasTablaProps) {
    const {
        distribuidorFilter,
        estadoFilter,
        setDistribuidorFilter,
        setEstadoFilter
    } = useNeveraFilterContext();

    const [filterValues, setFilterValues] = useState<Record<string, string>>({
        cod_nevera: "",
        imei: "",
        locacion: "",
        distribuidor: distribuidorFilter || "",
        estado: "",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({ column: "dis_ult_conex", direction: "descending" });

    
    const queryFilters = {
        cod_nevera: filterValues.cod_nevera,
        imei: filterValues.imei,
        locacion: filterValues.locacion,
        distribuidor: filterValues.distribuidor,
        estado: filterValues.estado,
    };

    const { data, isLoading, isFetching } = useGetNeverasDashboardQuery({
        ...queryFilters,
        page,
        size: pageSize,
        order: sortDescriptor.column,
        or: sortDescriptor.direction === "descending" ? "desc" : "asc",
    });

    const { data: paginacionData, isLoading: isLoadingPaginacion } = useGetContadorRegistrosPaginasQuery(queryFilters);

    const totalRegistros = paginacionData?.total_records ?? 0;

    useEffect(() => {
        if (externalFilter) {
            const estado = ESTADOS_NEVERA.find(e =>
                e.label.toLowerCase().includes(externalFilter.toLowerCase()) ||
                e.filterKey.toLowerCase().includes(externalFilter.toLowerCase())
            );

            if (estado) {
                setFilterValues(prev => ({ ...prev, estado: estado.filterKey }));
                setPage(1);
            }
        } else if (!estadoFilter) {
            setFilterValues(prev => {
                if (prev.estado !== "") {
                    return { ...prev, estado: "" };
                }
                return prev;
            });
            setPage(1);
        }
    }, [externalFilter]);

    useEffect(() => {
        if (distribuidorFilter) {
            setFilterValues(prev => ({
                ...prev,
                distribuidor: distribuidorFilter
            }));
            setPage(1);
        }

        if (estadoFilter) {
            setFilterValues(prev => ({
                ...prev,
                estado: estadoFilter
            }));
            setPage(1);
        }
    }, [distribuidorFilter, estadoFilter]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        setPage(1);

        if (key === "distribuidor") {
            setDistribuidorFilter(value);
        }

        if (key === "estado") {
            setEstadoFilter(value);
            if (onClearExternalFilter) {
                setTimeout(() => onClearExternalFilter(), 0);
            }
        }
    };

    const neveras = data?.data ?? [];

    const columns: CustomColumnDef<NeveraDashboardItem>[] = useMemo(
        () => [
            { key: "dis_cod_nevera", label: "Código Nevera", width: 130, sticky: true },
            { key: "dis_imei", label: "IMEI", width: 150, sticky: true },
            { key: "loc_nombre", label: "Locación", width: 150 },
            { key: "dis_distribuidor", label: "Distribuidor", width: 130 },
            { key: "dis_sincronizado", label: "Sincronizado", width: 120 },
            { key: "dis_ult_conex", label: "Última Conexión", width: 150 },
            { key: "dis_latitud_actual", label: "Latitud Actual", width: 110 },
            { key: "dis_longitud_actual", label: "Longitud Actual", width: 110 },
            { key: "dis_estado", label: "Estado", width: 170 },
            { key: "dis_movimiento", label: "Movimiento", width: 110 },
            { key: "dis_bateria", label: "Batería", width: 100 },
            { key: "dis_energia", label: "Energía", width: 110 },
            { key: "dis_desconexiones", label: "Desconexiones", width: 130 },
            { key: "dis_senial_celular", label: "Señal Celular", width: 120 },
            { key: "dis_senial_gps", label: "Señal GPS", width: 120 },
            { key: "dis_fecha_instalacion", label: "Fecha Instalación", width: 150 },
            { key: "dis_latitud_inst", label: "Latitud Instalación", width: 110 },
            { key: "dis_longitud_inst", label: "Longitud Instalación", width: 110 },
            { key: "dis_distancia_km_instalacion", label: "Distancia KM Instalación", width: 150 },
            { key: "dis_cliente_codigo", label: "Código Cliente", width: 130 },
            { key: "dis_cliente_nombre", label: "Cliente", width: 150 },
            { key: "dis_fecha_cartera", label: "Fecha Cartera", width: 150 },
            { key: "dis_latitud_cartera", label: "Latitud Cartera", width: 110 },
            { key: "dis_longitud_cartera", label: "Longitud Cartera", width: 110 },
            { key: "dis_distancia_km_cartera", label: "Distancia KM Cartera", width: 150 },
            { key: "dis_fecha_censo", label: "Fecha Censo", width: 150 },
            { key: "dis_latitud_censo", label: "Latitud Censo", width: 110 },
            { key: "dis_longitud_censo", label: "Longitud Censo", width: 110 },
            { key: "dis_distancia_km_censo", label: "Distancia KM Censo", width: 150 },
            { key: "dis_iccid", label: "ICCID", width: 150 },
        ],
        []
    );

    const columnGroups: ColumnGroupDef[] = [
        {
            label: "Identificación",
            columnKeys: ["dis_cod_nevera", "dis_imei", "loc_nombre", "dis_distribuidor", "dis_sincronizado"],
        },
        {
            label: "Última Data",
            columnKeys: [
                "dis_ult_conex",
                "dis_latitud_actual",
                "dis_longitud_actual",
                "dis_estado",
                "dis_movimiento",
                "dis_bateria",
                "dis_energia",
                "dis_desconexiones",
                "dis_senial_celular",
                "dis_senial_gps",
            ],
        },
        {
            label: "Instalación",
            columnKeys: [
                "dis_fecha_instalacion",
                "dis_latitud_inst",
                "dis_longitud_inst",
                "dis_distancia_km_instalacion",
            ],
        },
        {
            label: "Censo",
            columnKeys: [
                "dis_cliente_codigo",
                "dis_cliente_nombre",
                "dis_fecha_censo",
                "dis_latitud_censo",
                "dis_longitud_censo",
                "dis_distancia_km_censo",
            ],
        },
        {
            label: "Cartera",
            columnKeys: [
                "dis_fecha_cartera",
                "dis_latitud_cartera",
                "dis_longitud_cartera",
                "dis_distancia_km_cartera",
                "dis_iccid",
            ],
        },
    ];

    const filters: FilterFieldDef[] = [
        { key: "cod_nevera", type: "text", placeholder: "Cod Nevera" },
        { key: "imei", type: "text", placeholder: "IMEI" },
        { key: "locacion", type: "text", placeholder: "Locación" },
        { key: "distribuidor", type: "text", placeholder: "Distribuidor" },
        {
            key: "estado",
            type: "select",
            placeholder: "Estado",
            options: ESTADO_OPTIONS_TABLE,
        },
    ];

    const handleClearFilters = () => {
        setFilterValues({
            cod_nevera: "",
            imei: "",
            locacion: "",
            distribuidor: "",
            estado: "",
        });
        setPage(1);
        setDistribuidorFilter("");
        setEstadoFilter("");

        if (onClearExternalFilter) {
            onClearExternalFilter();
        }
    };

    return (
        <div>          
            <TableComponent
                data={neveras}
                columns={columns}
                columnGroups={columnGroups}
                idField="dis_cod_nevera"
                filters={filters}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                sortDescriptor={sortDescriptor}
                onSortChange={(d) => {
                    setSortDescriptor(d);
                    setPage(1);
                }}
                page={page}
                pageSize={pageSize}
                totalRegistros={totalRegistros}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
                isLoading={isLoading || isFetching || isLoadingPaginacion}
            />
        </div>
    );
}