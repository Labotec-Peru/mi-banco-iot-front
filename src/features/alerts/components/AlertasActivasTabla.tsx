import { useState, useMemo, useCallback } from "react";
import TableComponent, {
    type CustomColumnDef,
    type FilterFieldDef,
} from "../../../components/ux/TableComponent";
import { Chip, type DateValue } from "@heroui/react";
import {
    Bolt,
    LightbulbBolt,
} from "@solar-icons/react";
import { useTodayDate } from "../../../hooks/useTodayDate";

const PAGE_SIZE_DEFAULT = 15;

type Priority = "Alta" | "Media" | "Baja";
type AlertType =
    | "Bajo nivel de agua"
    | "Consumo atípico"
    | "Batería baja"
    | "Señal débil"
    | "Sin transmisión"
    | "Mantenimiento próximo"
    | "Flujo excesivo"
    | "Volumen máximo"
    | "Presión baja"
    | "Turbidez alta";

interface AlertItem {
    id: string;
    prioridad: Priority;
    medidor: string;
    tipo: AlertType;
    mensaje: string;
    fecha: string;
    volumen?: number;
    flujo?: number;
    presion?: number;
    ubicacion?: string;
    cliente?: string;
    estado: string;
    bateria: number;
    senal: number;
    energia: "Conectado" | "Desconectado";
    latitud: string;
    longitud: string;
    satelite: string;
}

const MOCK_ALERTS: AlertItem[] = [
    {
        id: "AL-001",
        prioridad: "Alta",
        medidor: "FL-21008212",
        tipo: "Bajo nivel de agua",
        mensaje: "Nivel crítico detectado en el tanque",
        fecha: "08 ago, 10:15",
        volumen: 245,
        flujo: 12.5,
        presion: 2.1,
        ubicacion: "Tanque Principal",
        cliente: "Industrias Líquidas S.A.",
        estado: "Activo",
        bateria: 78,
        senal: 65,
        energia: "Conectado",
        latitud: "-12.0433",
        longitud: "-77.0282",
        satelite: "GPS",
    },
    {
        id: "AL-002",
        prioridad: "Alta",
        medidor: "FM-1024",
        tipo: "Consumo atípico",
        mensaje: "Posible fuga: consumo 3x sobre el promedio",
        fecha: "08 ago, 09:40",
        volumen: 1850,
        flujo: 45.2,
        presion: 3.8,
        ubicacion: "Planta Norte",
        cliente: "Agua Potable del Sur",
        estado: "Activo",
        bateria: 92,
        senal: 78,
        energia: "Conectado",
        latitud: "-12.0892",
        longitud: "-77.0514",
        satelite: "GPS",
    },
    {
        id: "AL-003",
        prioridad: "Media",
        medidor: "FM-1026",
        tipo: "Batería baja",
        mensaje: "Voltaje de batería del sensor por debajo de 3.3V",
        fecha: "07 ago, 22:05",
        volumen: 320,
        flujo: 8.7,
        presion: 1.9,
        ubicacion: "Estación de Bombeo",
        cliente: "Servicios Hidráulicos",
        estado: "Pendiente",
        bateria: 12,
        senal: 45,
        energia: "Desconectado",
        latitud: "-12.0523",
        longitud: "-77.0321",
        satelite: "GPS",
    },
    {
        id: "AL-004",
        prioridad: "Media",
        medidor: "FL-21008212",
        tipo: "Señal débil",
        mensaje: "Calidad de señal CSQ menor a 10 por 3 lecturas seguidas",
        fecha: "07 ago, 18:12",
        volumen: 520,
        flujo: 15.3,
        presion: 2.7,
        ubicacion: "Tanque Principal",
        cliente: "Industrias Líquidas S.A.",
        estado: "Activo",
        bateria: 65,
        senal: 8,
        energia: "Conectado",
        latitud: "-12.0433",
        longitud: "-77.0282",
        satelite: "GPS",
    },
    {
        id: "AL-005",
        prioridad: "Baja",
        medidor: "FM-1030",
        tipo: "Sin transmisión",
        mensaje: "El sensor no reporta hace más de 6 horas",
        fecha: "07 ago, 14:00",
        volumen: 0,
        flujo: 0,
        presion: 0,
        ubicacion: "Zona Industrial",
        cliente: "Distribuidora de Agua",
        estado: "Inactivo",
        bateria: 3,
        senal: 0,
        energia: "Desconectado",
        latitud: "-12.1012",
        longitud: "-77.0456",
        satelite: "GPS",
    },
    {
        id: "AL-006",
        prioridad: "Alta",
        medidor: "FM-1028",
        tipo: "Flujo excesivo",
        mensaje: "Flujo detectado 8.2 L/s por encima del límite máximo",
        fecha: "07 ago, 08:30",
        volumen: 2340,
        flujo: 82.5,
        presion: 4.2,
        ubicacion: "Planta Sur",
        cliente: "Hidro Sistemas",
        estado: "Activo",
        bateria: 88,
        senal: 72,
        energia: "Conectado",
        latitud: "-12.0678",
        longitud: "-77.0399",
        satelite: "GPS",
    },
    {
        id: "AL-007",
        prioridad: "Baja",
        medidor: "FM-1024",
        tipo: "Mantenimiento próximo",
        mensaje: "Sensor cumple 12 meses instalado",
        fecha: "06 ago, 16:45",
        volumen: 1250,
        flujo: 28.3,
        presion: 3.1,
        ubicacion: "Planta Norte",
        cliente: "Agua Potable del Sur",
        estado: "Pendiente",
        bateria: 95,
        senal: 82,
        energia: "Conectado",
        latitud: "-12.0892",
        longitud: "-77.0514",
        satelite: "GPS",
    },
    {
        id: "AL-008",
        prioridad: "Media",
        medidor: "FL-21008212",
        tipo: "Volumen máximo",
        mensaje: "Volumen de 5250 m³ supera el máximo permitido",
        fecha: "06 ago, 11:20",
        volumen: 5250,
        flujo: 35.8,
        presion: 3.5,
        ubicacion: "Tanque Principal",
        cliente: "Industrias Líquidas S.A.",
        estado: "Activo",
        bateria: 70,
        senal: 60,
        energia: "Conectado",
        latitud: "-12.0433",
        longitud: "-77.0282",
        satelite: "GPS",
    },
    {
        id: "AL-009",
        prioridad: "Alta",
        medidor: "FM-1035",
        tipo: "Presión baja",
        mensaje: "Presión de 0.8 bar por debajo del mínimo operativo",
        fecha: "06 ago, 09:15",
        volumen: 180,
        flujo: 5.2,
        presion: 0.8,
        ubicacion: "Red Principal",
        cliente: "Sistema Metropolitano de Agua",
        estado: "Activo",
        bateria: 55,
        senal: 40,
        energia: "Conectado",
        latitud: "-12.1123",
        longitud: "-77.0587",
        satelite: "GPS",
    },
    {
        id: "AL-010",
        prioridad: "Media",
        medidor: "FM-1040",
        tipo: "Turbidez alta",
        mensaje: "Nivel de turbidez 12 NTU supera el límite de 5 NTU",
        fecha: "05 ago, 20:30",
        volumen: 420,
        flujo: 18.7,
        presion: 2.9,
        ubicacion: "Planta de Tratamiento",
        cliente: "Agua Limpia S.A.",
        estado: "Activo",
        bateria: 82,
        senal: 75,
        energia: "Conectado",
        latitud: "-12.0756",
        longitud: "-77.0482",
        satelite: "GPS",
    },
    {
        id: "AL-011",
        prioridad: "Alta",
        medidor: "FM-1045",
        tipo: "Consumo atípico",
        mensaje: "Consumo 5.2x sobre el promedio en las últimas 2 horas",
        fecha: "05 ago, 14:45",
        volumen: 780,
        flujo: 52.1,
        presion: 3.2,
        ubicacion: "Zona Industrial Este",
        cliente: "Industrias Químicas",
        estado: "Activo",
        bateria: 90,
        senal: 85,
        energia: "Conectado",
        latitud: "-12.0987",
        longitud: "-77.0213",
        satelite: "GPS",
    },
    {
        id: "AL-012",
        prioridad: "Baja",
        medidor: "FL-2100830",
        tipo: "Mantenimiento próximo",
        mensaje: "Revisión de flujómetro programada para los próximos 7 días",
        fecha: "05 ago, 10:00",
        volumen: 980,
        flujo: 22.4,
        presion: 2.5,
        ubicacion: "Estación de Control",
        cliente: "Servicios de Agua Potable",
        estado: "Pendiente",
        bateria: 75,
        senal: 68,
        energia: "Conectado",
        latitud: "-12.0543",
        longitud: "-77.0332",
        satelite: "GPS",
    },
    {
        id: "AL-013",
        prioridad: "Media",
        medidor: "FM-1050",
        tipo: "Señal débil",
        mensaje: "Intermitencia en señal, 5 lecturas perdidas",
        fecha: "04 ago, 23:20",
        volumen: 150,
        flujo: 3.8,
        presion: 1.2,
        ubicacion: "Periferia Norte",
        cliente: "Agua Rural",
        estado: "Activo",
        bateria: 45,
        senal: 12,
        energia: "Desconectado",
        latitud: "-12.0321",
        longitud: "-77.0623",
        satelite: "GPS",
    },
    {
        id: "AL-014",
        prioridad: "Alta",
        medidor: "FM-1055",
        tipo: "Bajo nivel de agua",
        mensaje: "Nivel crítico en tanque elevado",
        fecha: "04 ago, 15:30",
        volumen: 85,
        flujo: 2.1,
        presion: 0.9,
        ubicacion: "Tanque Elevado Norte",
        cliente: "Sistema de Agua Municipal",
        estado: "Activo",
        bateria: 68,
        senal: 55,
        energia: "Conectado",
        latitud: "-12.0789",
        longitud: "-77.0412",
        satelite: "GPS",
    },
    {
        id: "AL-015",
        prioridad: "Media",
        medidor: "FM-1060",
        tipo: "Flujo excesivo",
        mensaje: "Caudal de 95.6 L/s registrado en horas de bajo consumo",
        fecha: "04 ago, 02:15",
        volumen: 3120,
        flujo: 95.6,
        presion: 5.1,
        ubicacion: "Ramal Principal",
        cliente: "Distribuidora de Agua Industrial",
        estado: "Activo",
        bateria: 85,
        senal: 70,
        energia: "Conectado",
        latitud: "-12.0912",
        longitud: "-77.0521",
        satelite: "GPS",
    },
];

const getPriorityColor = (priority: Priority): "danger" | "warning" | "default" => {
    switch (priority) {
        case "Alta":
            return "danger";
        case "Media":
            return "warning";
        case "Baja":
            return "default";
        default:
            return "default";
    }
};

const getTypeIcon = (tipo: AlertType) => {
    switch (tipo) {
        case "Bajo nivel de agua":
            return <LightbulbBolt size={16} className="text-blue-500" />;
        case "Consumo atípico":
        case "Flujo excesivo":
            return <LightbulbBolt size={16} className="text-orange-500" />;
        case "Volumen máximo":
            return <LightbulbBolt size={16} className="text-red-500" />;
        case "Batería baja":
        case "Sin transmisión":
        case "Señal débil":
            return <LightbulbBolt size={16} className="text-yellow-500" />;
        default:
            return <LightbulbBolt size={16} className="text-gray-500" />;
    }
};

export default function AlertsTabla() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({
        medidor: "",
        tipo: "",
        prioridad: "",
        ubicacion: "",
        cliente: "",
        fecha: "",
    });

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({ column: "fecha", direction: "descending" });
    const today = useTodayDate();
    const [dateValue, setDateValue] = useState<DateValue | null>(today);

    const filteredAndSortedData = useMemo(() => {
        let filtered = [...MOCK_ALERTS];

        if (filterValues.medidor) {
            filtered = filtered.filter((alert) =>
                alert.medidor.toLowerCase().includes(filterValues.medidor.toLowerCase())
            );
        }
        if (filterValues.tipo) {
            filtered = filtered.filter((alert) =>
                alert.tipo.toLowerCase().includes(filterValues.tipo.toLowerCase())
            );
        }
        if (filterValues.prioridad) {
            filtered = filtered.filter((alert) =>
                alert.prioridad.toLowerCase().includes(filterValues.prioridad.toLowerCase())
            );
        }
        if (filterValues.ubicacion) {
            filtered = filtered.filter((alert) =>
                alert.ubicacion?.toLowerCase().includes(filterValues.ubicacion.toLowerCase())
            );
        }
        if (filterValues.cliente) {
            filtered = filtered.filter((alert) =>
                alert.cliente?.toLowerCase().includes(filterValues.cliente.toLowerCase())
            );
        }
        if (filterValues.fecha) {
            filtered = filtered.filter((alert) =>
                alert.fecha.includes(filterValues.fecha)
            );
        }

        filtered.sort((a, b) => {
            const aVal = a[sortDescriptor.column as keyof AlertItem] ?? "";
            const bVal = b[sortDescriptor.column as keyof AlertItem] ?? "";

            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDescriptor.direction === "ascending"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDescriptor.direction === "ascending"
                    ? aVal - bVal
                    : bVal - aVal;
            }
            return 0;
        });

        return filtered;
    }, [filterValues, sortDescriptor]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return filteredAndSortedData.slice(start, end);
    }, [filteredAndSortedData, page, pageSize]);

    const totalRegistros = filteredAndSortedData.length;

    const handleDateChange = useCallback((date: DateValue | null) => {
        setDateValue(date);
        if (date) {
            const formatted = `${String(date.day).padStart(2, '0')} ${getMonthName(date.month)}, ${date.year}`;
            setFilterValues((prev) => ({ ...prev, fecha: formatted }));
        } else {
            setFilterValues((prev) => ({ ...prev, fecha: "" }));
        }
        setPage(1);
    }, []);

    const getMonthName = (month: number): string => {
        const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return months[month - 1];
    };

    const columns: CustomColumnDef<AlertItem>[] = useMemo(
        () => [
           
            {
                key: "prioridad",
                label: "Prioridad",
                width: 100,
                render: (item) => (
                    <Chip size="sm" color={getPriorityColor(item.prioridad)} variant="flat">
                        {item.prioridad}
                    </Chip>
                ),
            },
            {
                key: "medidor",
                label: "Medidor",
                width: 160,
                render: (item) => (
                    <div className="flex flex-col leading-tight">
                        <span className="font-medium ">{item.medidor}</span>
                        <span className="text-[11px] text-slate-400">
                            {item.ubicacion || "N/A"}
                        </span>
                    </div>
                ),
            },
            {
                key: "tipo",
                label: "Tipo",
                width: 150,
                render: (item) => (
                    <div className="flex items-center gap-2">
                        {getTypeIcon(item.tipo)}
                        <span className="text-sm">{item.tipo}</span>
                    </div>
                ),
            },
            {
                key: "mensaje",
                label: "Mensaje",
                width: 250,
                render: (item) => (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm ">{item.mensaje}</span>
                        <div className="flex gap-3 text-[11px] text-slate-400">
                            {item.volumen && (
                                <span className="flex items-center gap-1">
                                    <LightbulbBolt size={12} />
                                    {item.volumen.toLocaleString()} m³
                                </span>
                            )}
                            {item.flujo && (
                                <span className="flex items-center gap-1">
                                    <LightbulbBolt size={12} />
                                    {item.flujo} L/s
                                </span>
                            )}
                            {item.presion && (
                                <span className="flex items-center gap-1">
                                    <LightbulbBolt size={12} />
                                    {item.presion} bar
                                </span>
                            )}
                        </div>
                    </div>
                ),
            },
            {
                key: "fecha",
                label: "Fecha/Hora",
                width: 130,
                render: (item) => (
                    <span className="text-sm ">{item.fecha}</span>
                ),
            },
            {
                key: "cliente",
                label: "Cliente",
                width: 180,
                render: (item) => (
                    <span className="text-sm ">{item.cliente || "N/A"}</span>
                ),
            },
            {
                key: "estado",
                label: "Estado",
                width: 120,
                align: "center",
                render: (item) => {
                    const map: Record<string, "success" | "warning" | "danger" | "default"> = {
                        Activo: "success",
                        Pendiente: "warning",
                        Inactivo: "danger",
                    };
                    return (
                        <Chip size="sm" color={map[item.estado] || "default"} variant="flat">
                            {item.estado}
                        </Chip>
                    );
                },
            },
            {
                key: "bateria",
                label: "Batería",
                width: 140,
                render: (item) => {
                    const pct = item.bateria;
                    const color = pct > 50 ? "bg-green-500" : pct > 20 ? "bg-amber-500" : "bg-red-500";

                    return (
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs">{pct}%</span>
                        </div>
                    );
                },
            },
            {
                key: "energia",
                label: "Energía",
                width: 100,
                align: "start",
                render: (item) => (
                    <div className="flex items-center gap-1">
                        {item.energia === "Conectado" ? (
                            <span className="flex items-center gap-1 text-secondary">
                                <Bolt weight="Bold" size={18} />
                                <span>ON</span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-slate-400">
                                <Bolt weight="Bold" size={18} />
                                <span>OFF</span>
                            </span>
                        )}
                    </div>
                ),
            },
            {
                key: "senal",
                label: "Señal",
                width: 100,
                render: (item) => {
                    const pct = item.senal;
                    const color = pct > 60 ? "text-green-600" : pct > 30 ? "text-amber-500" : "text-red-500";
                    return <span className={`font-medium ${color}`}>{pct}%</span>;
                },
            },
            {
                key: "latitud",
                label: "Latitud",
                width: 120,
                render: (item) => (
                    <span className="text-sm font-mono">{item.latitud}</span>
                ),
            },
            {
                key: "longitud",
                label: "Longitud",
                width: 120,
                render: (item) => (
                    <span className="text-sm font-mono">{item.longitud}</span>
                ),
            },
            {
                key: "satelite",
                label: "Satélite",
                width: 100,
                render: (item) => (
                    <span className="text-sm">{item.satelite}</span>
                ),
            },
        ],
        []
    );

    const filters: FilterFieldDef[] = [
        { key: "medidor", type: "text", placeholder: "Buscar medidor" },
        { key: "tipo", type: "text", placeholder: "Tipo de alerta" },
        { key: "prioridad", type: "text", placeholder: "Prioridad" },
        { key: "ubicacion", type: "text", placeholder: "Ubicación" },
        { key: "cliente", type: "text", placeholder: "Cliente" },
        { key: "fecha", type: "date", placeholder: "Fecha" },
    ];

    const handleClearFilters = () => {
        setFilterValues({
            medidor: "",
            tipo: "",
            prioridad: "",
            ubicacion: "",
            cliente: "",
            fecha: "",
        });
        setDateValue(today);
        setPage(1);
    };

    return (
        <div>
            <TableComponent
                data={paginatedData}
                columns={columns}
                idField="id"
                filters={filters}
                filterValues={filterValues}
                onFilterChange={(key, value) => {
                    if (key === "fecha") return;
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
                isLoading={false}
            />
        </div>
    );
}