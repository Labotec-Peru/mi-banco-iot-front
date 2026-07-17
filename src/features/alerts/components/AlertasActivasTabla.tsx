import { useState, useMemo, useCallback } from "react";
import TableComponent, {
    type CustomColumnDef,
    type FilterFieldDef,
} from "../../../components/ux/TableComponent";
import { useGetAlertsHistoricalQuery, useGetAlertsHistoricalCountQuery } from "../services/alertsApi";
import type { AlertsFilters, AlertsItem } from "../services/alertsApi";
import { Chip, type DateValue } from "@heroui/react";
import { LightbulbBolt, LightbulbMinimalistic } from "@solar-icons/react";
import { useTodayDate } from "../../../hooks/useTodayDate";

const PAGE_SIZE_DEFAULT = 15;

export default function AlertsTabla() {
    const [filterValues, setFilterValues] = useState<AlertsFilters>({
        _cliente: "",
        _cod_nevera: "",
        _distribuidor: "",
        _evento: "",
        _fecha_hora: "",
        _imei: "",
        _locacion: "",
        _or: "desc",
        _order: "dis_ult_conex",
        _page: 1,
        _size: PAGE_SIZE_DEFAULT,
    });

    const countFilters: AlertsFilters = {
        _cliente: filterValues._cliente,
        _cod_nevera: filterValues._cod_nevera,
        _distribuidor: filterValues._distribuidor,
        _evento: filterValues._evento,
        _fecha_hora: filterValues._fecha_hora,
        _imei: filterValues._imei,
        _locacion: filterValues._locacion,
    };

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({ column: "dis_ult_conex", direction: "descending" });
    const today = useTodayDate();
    const [dateValue, setDateValue] = useState<DateValue | null>(today);

    const queryFilters: AlertsFilters = {
        ...countFilters,
        _or: sortDescriptor.direction === "ascending" ? "asc" : "desc",
        _order: sortDescriptor.column,
        _page: page,
        _size: pageSize,
    };

    const { data, isLoading, isFetching } = useGetAlertsHistoricalQuery(queryFilters);


    const { data: countData, isLoading: isCountLoading } = useGetAlertsHistoricalCountQuery(countFilters);

    const alerts = data?.data ?? [];
    const totalRegistros = countData?.total_records ?? 0;

    const handleDateChange = useCallback((date: DateValue | null) => {
        setDateValue(date);
        if (date) {
            const formatted = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
            setFilterValues((prev) => ({ ...prev, _fecha_hora: formatted }));
        } else {
            setFilterValues((prev) => ({ ...prev, _fecha_hora: "" }));
        }
        setPage(1);
    }, []);

    const columns: CustomColumnDef<AlertsItem>[] = useMemo(
        () => [
            {
                key: "alert_dis_cod_nevera",
                label: "Nevera",
                width: 200,
                sticky: true,
                render: (item) => (
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-slate-700">{item.alert_dis_cod_nevera}</span>
                            <span className="text-[11px] text-slate-400">{item.alert_dis_imei}</span>
                        </div>
                    </div>
                ),
            },
            { key: "alert_dis_distribuidor", label: "Distribuidor", width: 130 },
            { key: "alert_loc_nom", label: "Locación", width: 130 },
            {
                key: "alert_dis_bateria",
                label: "Batería",
                width: 140,
                render: (item) => {
                    const value = item.alert_dis_bateria ?? "";
                    const pct = Number(value.replace("%", "").trim());

                    if (Number.isNaN(pct)) {
                        return <span className="text-xs text-slate-500">{value}</span>;
                    }

                    const color = pct > 50 ? "bg-green-500" : pct > 20 ? "bg-amber-500" : "bg-red-500";

                    return (
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-slate-500">{pct}%</span>
                        </div>
                    );
                },
            },
            {
                key: "alert_dis_energia",
                label: "Energía",
                width: 100,
                align: "start",
                render: (item) => (
                    <div className="flex items-center gap-1">
                        {item.alert_dis_energia === "Conectado" ? (
                            <span className="flex items-center gap-1 text-green-600">
                                <LightbulbBolt weight="Bold" size={18} />
                                <span>ON</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-slate-400">
                                <LightbulbMinimalistic weight="Bold" size={18} />
                                <span>OFF</span>
                            </span>
                        )}
                    </div>
                ),
            },
            { key: "alert_dis_lat", label: "Latitud", width: 130 },
            { key: "alert_dis_lon", label: "Longitud", width: 130 },
            { key: "alert_dis_signal", label: "Señal", width: 130 },
            { key: "alert_dis_satelite", label: "Satélite", width: 130 },
            {
                key: "alert_evento",
                label: "Estado",
                width: 130,
                align: "center",
                render: (item) => {
                    const estado = item.alert_evento?.toLowerCase();
                    const map: Record<string, "secondary" | "danger" | "warning" | "default"> = {
                        "desconexión por energía": "warning",
                        "detenido fuera de zona": "danger",
                        "movimiento fuera de zona": "secondary",
                    };
                    return (
                        <Chip size="sm" variant="light" color={map[estado] ?? "default"}>
                            {item.alert_evento}
                        </Chip>
                    );
                },
            },
            { key: "alert_dis_fechahora", label: "Fecha/Hora", width: 130 },
            { key: "alert_dis_cliente", label: "Cliente", width: 130 },
        ],
        []
    );

    const filters: FilterFieldDef[] = [
        { key: "_cod_nevera", type: "text", placeholder: "Cod Nevera" },
        { key: "_cliente", type: "text", placeholder: "Cliente" },
        { key: "_distribuidor", type: "text", placeholder: "Distribuidor" },
        { key: "_evento", type: "text", placeholder: "Evento" },
        { key: "_fecha", type: "date", placeholder: "Fecha" },
        { key: "_imei", type: "text", placeholder: "IMEI" },
        { key: "_locacion", type: "text", placeholder: "Locación" },
    ];

    const handleClearFilters = () => {
        setFilterValues({
            _cliente: "",
            _cod_nevera: "",
            _distribuidor: "",
            _evento: "",
            _fecha_hora: "",
            _imei: "",
            _locacion: "",
            _or: "desc",
            _order: "dis_ult_conex",
            _page: 1,
            _size: PAGE_SIZE_DEFAULT,
        });
        setDateValue(today);
        setPage(1);
    };

    const alertsWithUniqueId = useMemo(() => {
        return alerts.map((alert, index) => ({
            ...alert,
            _uniqueId: `${alert.alert_dis_cod_nevera}_${alert.alert_dis_fechahora}_${alert.alert_evento}_${index}`,
        }));
    }, [alerts]);

    return (
        <div>
            <TableComponent
                data={alertsWithUniqueId}
                columns={columns}
                idField="_uniqueId"
                filters={filters}
                filterValues={filterValues as Record<string, string>}
                onFilterChange={(key, value) => {
                    if (key === "_fecha") return;
                    setFilterValues((prev) => ({ ...prev, [key]: value }));
                    setPage(1);
                }}
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
                dateValue={dateValue}
                onDateChange={handleDateChange}
                isLoading={isLoading || isFetching || isCountLoading}
            />
        </div>
    );
}