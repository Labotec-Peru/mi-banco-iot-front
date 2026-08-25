import { useState, useMemo } from "react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent, {
    type CustomColumnDef,
    type FilterFieldDef,
} from "../../../components/ux/TableComponent";
import { Chip, Button, Tooltip, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
    ListArrowDown,
    Widget,
    CheckCircle,
    CloseCircle,
    Refresh,
    Settings,
} from "@solar-icons/react";
import StatsRow from "../../dashboard/components/StatsRow";

const PAGE_SIZE_DEFAULT = 15;
type ViewMode = "table" | "cards";
type CommandStatus = "Pendiente" | "Aplicado" | "Fallido";

interface CommandItem {
    id: string;
    comando: string;
    medidor: string;
    estado: CommandStatus;
    solicitadoPor: string;
    fechaSolicitud: string;
    fechaResolucion: string | null;
    detalle: string;
    cliente?: string;
    ubicacion?: string;
    prioridad: "Alta" | "Media" | "Baja";
}

const MOCK_COMMANDS: CommandItem[] = [
    {
        id: "CMD-001",
        comando: "Reinicio de sensor solicitado por soporte",
        medidor: "#DA21008212",
        estado: "Pendiente",
        solicitadoPor: "Roberto Tapia",
        fechaSolicitud: "08 ago 2026, 15:40",
        fechaResolucion: null,
        detalle: "Reset",
        cliente: "Industrias Líquidas S.A.",
        ubicacion: "Tanque Principal",
        prioridad: "Alta",
    },
    {
        id: "CMD-002",
        comando: "Ajuste de intervalo de reporte",
        medidor: "#DH-1024",
        estado: "Aplicado",
        solicitadoPor: "María González",
        fechaSolicitud: "07 ago 2026, 09:12",
        fechaResolucion: "07 ago 2026, 10:30",
        detalle: "Intervalo: 5 min → 2 min",
        cliente: "Agua Potable del Sur",
        ubicacion: "Planta Norte",
        prioridad: "Media",
    },
    {
        id: "CMD-003",
        comando: "Reinicio por señal intermitente",
        medidor: "#DH-1026",
        estado: "Fallido",
        solicitadoPor: "Carlos Méndez",
        fechaSolicitud: "06 ago 2026, 18:05",
        fechaResolucion: "06 ago 2026, 18:45",
        detalle: "Hard reset",
        cliente: "Servicios Hidráulicos",
        ubicacion: "Estación de Bombeo",
        prioridad: "Alta",
    },
    {
        id: "CMD-004",
        comando: "Actualización de umbral de alerta",
        medidor: "#DA21008212",
        estado: "Aplicado",
        solicitadoPor: "Ana Lucía Pérez",
        fechaSolicitud: "05 ago 2026, 11:30",
        fechaResolucion: "05 ago 2026, 12:15",
        detalle: "Umbral: 80% → 85%",
        cliente: "Industrias Líquidas S.A.",
        ubicacion: "Tanque Principal",
        prioridad: "Media",
    },
    {
        id: "CMD-005",
        comando: "Cambio de parámetros de flujo",
        medidor: "#FM-1028",
        estado: "Pendiente",
        solicitadoPor: "Jorge Ramírez",
        fechaSolicitud: "04 ago 2026, 14:20",
        fechaResolucion: null,
        detalle: "Flujo máx: 75 L/s → 85 L/s",
        cliente: "Hidro Sistemas",
        ubicacion: "Planta Sur",
        prioridad: "Alta",
    },
    {
        id: "CMD-006",
        comando: "Actualización de firmware",
        medidor: "#FM-1030",
        estado: "Aplicado",
        solicitadoPor: "Patricia Suárez",
        fechaSolicitud: "03 ago 2026, 08:00",
        fechaResolucion: "03 ago 2026, 09:45",
        detalle: "Firmware v2.1.3 → v2.2.0",
        cliente: "Distribuidora de Agua",
        ubicacion: "Zona Industrial",
        prioridad: "Baja",
    },
    {
        id: "CMD-007",
        comando: "Reconfiguración de red",
        medidor: "#FM-1035",
        estado: "Fallido",
        solicitadoPor: "Luis Fernández",
        fechaSolicitud: "02 ago 2026, 16:50",
        fechaResolucion: "02 ago 2026, 17:30",
        detalle: "Reconfigurar APN",
        cliente: "Sistema Metropolitano de Agua",
        ubicacion: "Red Principal",
        prioridad: "Media",
    },
    {
        id: "CMD-008",
        comando: "Calibración de sensor de presión",
        medidor: "#FM-1040",
        estado: "Pendiente",
        solicitadoPor: "Elena Torres",
        fechaSolicitud: "01 ago 2026, 10:15",
        fechaResolucion: null,
        detalle: "Offset: 0.2 bar",
        cliente: "Agua Limpia S.A.",
        ubicacion: "Planta de Tratamiento",
        prioridad: "Media",
    },
    {
        id: "CMD-009",
        comando: "Reinicio programado",
        medidor: "#FM-1045",
        estado: "Aplicado",
        solicitadoPor: "Sistema automático",
        fechaSolicitud: "31 jul 2026, 03:00",
        fechaResolucion: "31 jul 2026, 03:05",
        detalle: "Reset automático",
        cliente: "Industrias Químicas",
        ubicacion: "Zona Industrial Este",
        prioridad: "Baja",
    },
    {
        id: "CMD-010",
        comando: "Cambio de intervalo de reporte",
        medidor: "#FL-2100830",
        estado: "Aplicado",
        solicitadoPor: "Gabriela Mora",
        fechaSolicitud: "30 jul 2026, 13:45",
        fechaResolucion: "30 jul 2026, 14:20",
        detalle: "Intervalo: 10 min → 5 min",
        cliente: "Servicios de Agua Potable",
        ubicacion: "Estación de Control",
        prioridad: "Baja",
    },
    {
        id: "CMD-011",
        comando: "Reinicio por falla de comunicación",
        medidor: "#FM-1050",
        estado: "Pendiente",
        solicitadoPor: "Andrés Silva",
        fechaSolicitud: "29 jul 2026, 22:10",
        fechaResolucion: null,
        detalle: "Soft reset",
        cliente: "Agua Rural",
        ubicacion: "Periferia Norte",
        prioridad: "Alta",
    },
    {
        id: "CMD-012",
        comando: "Actualización de parámetros de volumen",
        medidor: "#FM-1055",
        estado: "Aplicado",
        solicitadoPor: "Diana Rojas",
        fechaSolicitud: "28 jul 2026, 09:30",
        fechaResolucion: "28 jul 2026, 10:00",
        detalle: "Volumen máx: 5000 m³ → 5500 m³",
        cliente: "Sistema de Agua Municipal",
        ubicacion: "Tanque Elevado Norte",
        prioridad: "Media",
    },
];

const getStatusConfig = (status: CommandStatus) => {
    switch (status) {
        case "Pendiente":
            return { color: "warning" as const, icon: ListArrowDown, label: "Pendiente" };
        case "Aplicado":
            return { color: "success" as const, icon: CheckCircle, label: "Aplicado" };
        case "Fallido":
            return { color: "danger" as const, icon: CloseCircle, label: "Fallido" };
        default:
            return { color: "default" as const, icon: ListArrowDown, label: "Desconocido" };
    }
};

const getPriorityConfig = (priority: CommandItem["prioridad"]) => {
    switch (priority) {
        case "Alta":
            return { color: "danger" as const, icon: ListArrowDown };
        case "Media":
            return { color: "warning" as const, icon: ListArrowDown };
        case "Baja":
            return { color: "default" as const, icon: Refresh };
    }
};

export default function Command() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({
        comando: "",
        medidor: "",
        estado: "",
        cliente: "",
        ubicacion: "",
    });
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({ column: "fechaSolicitud", direction: "descending" });

    const filteredData = useMemo(() => {
        let items = [...MOCK_COMMANDS];

        if (filterValues.comando) {
            const q = filterValues.comando.toLowerCase();
            items = items.filter((cmd) => cmd.comando.toLowerCase().includes(q));
        }
        if (filterValues.medidor) {
            items = items.filter((cmd) => cmd.medidor.toLowerCase().includes(filterValues.medidor.toLowerCase()));
        }
        if (filterValues.estado) {
            items = items.filter((cmd) => cmd.estado === filterValues.estado);
        }
        if (filterValues.cliente) {
            items = items.filter((cmd) => cmd.cliente?.toLowerCase().includes(filterValues.cliente.toLowerCase()));
        }
        if (filterValues.ubicacion) {
            items = items.filter((cmd) => cmd.ubicacion?.toLowerCase().includes(filterValues.ubicacion.toLowerCase()));
        }

        items.sort((a, b) => {
            const aVal = a[sortDescriptor.column as keyof CommandItem] ?? "";
            const bVal = b[sortDescriptor.column as keyof CommandItem] ?? "";
            const cmp = String(aVal).localeCompare(String(bVal));
            return sortDescriptor.direction === "ascending" ? cmp : -cmp;
        });

        return items;
    }, [filterValues, sortDescriptor]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, page, pageSize]);

    const getStatusCounts = () => {
        const counts = { Pendiente: 0, Aplicado: 0, Fallido: 0 };
        MOCK_COMMANDS.forEach((cmd) => {
            if (cmd.estado in counts) {
                counts[cmd.estado as keyof typeof counts]++;
            }
        });
        return counts;
    };

    const statusCounts = getStatusCounts();

    const columns: CustomColumnDef<CommandItem>[] = useMemo(
        () => [
            {
                key: "comando",
                label: "Comando",
                width: 280,
                render: (item) => (
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium ">{item.comando}</span>
                        <span className="text-[11px] text-slate-400">{item.detalle}</span>
                    </div>
                ),
            },
            {
                key: "medidor",
                label: "Medidor",
                width: 140,
                render: (item) => (
                    <span className="font-mono text-sm font-medium text-primary">{item.medidor}</span>
                ),
            },
            {
                key: "estado",
                label: "Estado",
                width: 130,
                align: "center",
                render: (item) => {
                    const cfg = getStatusConfig(item.estado);
                    const Icon = cfg.icon;
                    return (
                        <Chip
                            size="sm"
                            variant="flat"
                            color={cfg.color}
                            startContent={<Icon size={14} />}
                        >
                            {cfg.label}
                        </Chip>
                    );
                },
            },
            {
                key: "solicitadoPor",
                label: "Solicitado por",
                width: 160,
                render: (item) => (
                    <span className="text-sm ">{item.solicitadoPor}</span>
                ),
            },
            {
                key: "fechaSolicitud",
                label: "Fecha solicitud",
                width: 150,
                render: (item) => (
                    <span className="text-sm ">{item.fechaSolicitud}</span>
                ),
            },
            {
                key: "fechaResolucion",
                label: "Fecha resolución",
                width: 150,
                render: (item) => (
                    <span className="text-sm text-slate-500">
                        {item.fechaResolucion || "—"}
                    </span>
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
                key: "prioridad",
                label: "Prioridad",
                width: 100,
                render: (item) => {
                    const cfg = getPriorityConfig(item.prioridad);
                    return (
                        <Chip size="sm" color={cfg.color} variant="flat">
                            {item.prioridad}
                        </Chip>
                    );
                },
            },
            {
                key: "acciones",
                label: "",
                width: 120,
                sortable: false,
                align: "center",
                render: (item) => (
                    <div className="flex items-center gap-1">
                        <Tooltip content="Marcar aplicado" size="sm">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="success"
                                radius="full"
                                isDisabled={item.estado !== "Pendiente"}
                            >
                                <CheckCircle size={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Marcar fallido" size="sm">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                color="danger"
                                radius="full"
                                isDisabled={item.estado !== "Pendiente"}
                            >
                                <CloseCircle size={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Ver detalle" size="sm">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                radius="full"
                            >
                                <Settings size={16} className="text-default-500" />
                            </Button>
                        </Tooltip>
                    </div>
                ),
            },
        ],
        []
    );

    const filters: FilterFieldDef[] = [
        { key: "comando", type: "text", placeholder: "Buscar comando" },
        { key: "medidor", type: "text", placeholder: "N° medidor" },
        {
            key: "estado",
            type: "select",
            placeholder: "Estado",
            options: [
                { value: "Pendiente", label: "Pendiente" },
                { value: "Aplicado", label: "Aplicado" },
                { value: "Fallido", label: "Fallido" },
            ],
        },
        { key: "cliente", type: "text", placeholder: "Cliente" },
        { key: "ubicacion", type: "text", placeholder: "Ubicación" },
    ];

    const handleClearFilters = () => {
        setFilterValues({
            comando: "",
            medidor: "",
            estado: "",
            cliente: "",
            ubicacion: "",
        });
        setPage(1);
    };

    const CommandCard = ({ command }: { command: CommandItem }) => {
        const statusCfg = getStatusConfig(command.estado);
        const priorityCfg = getPriorityConfig(command.prioridad);
        const StatusIcon = statusCfg.icon;

        return (
            <Card shadow="none" className="w-full">
                <CardHeader className="flex justify-between items-start p-4">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <Chip size="sm" color={priorityCfg.color} variant="flat">
                                {command.prioridad}
                            </Chip>
                            <Chip
                                size="sm"
                                color={statusCfg.color}
                                variant="flat"
                                startContent={<StatusIcon size={14} />}
                            >
                                {statusCfg.label}
                            </Chip>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800">{command.comando}</h3>
                        <p className="text-xs text-slate-500">{command.detalle}</p>
                    </div>
                    <span className="font-mono text-xs font-medium text-primary">{command.medidor}</span>
                </CardHeader>
                <CardBody className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-slate-500">Solicitado por:</span>
                            <p className="font-medium ">{command.solicitadoPor}</p>
                        </div>
                        <div>
                            <span className="text-slate-500">Fecha solicitud:</span>
                            <p className="font-medium ">{command.fechaSolicitud}</p>
                        </div>
                        <div>
                            <span className="text-slate-500">Fecha resolución:</span>
                            <p className="font-medium ">
                                {command.fechaResolucion || "—"}
                            </p>
                        </div>
                        <div>
                            <span className="text-slate-500">Ubicación:</span>
                            <p className="font-medium ">{command.ubicacion || "N/A"}</p>
                        </div>
                        <div className="col-span-2">
                            <span className="text-slate-500">Cliente:</span>
                            <p className="font-medium ">{command.cliente || "N/A"}</p>
                        </div>
                        <div className="col-span-2 flex gap-2 mt-2">
                            <Button
                                size="sm"
                                color="success"
                                variant="flat"
                                startContent={<CheckCircle size={16} />}
                                isDisabled={command.estado !== "Pendiente"}
                                className="flex-1"
                            >
                                Aplicar
                            </Button>
                            <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                startContent={<CloseCircle size={16} />}
                                isDisabled={command.estado !== "Pendiente"}
                                className="flex-1"
                            >
                                Fallar
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    };

    return (
        <PageContainer>
            <StatsRow />
            <TableComponent
                data={paginatedData}
                columns={columns}
                idField="id"
                filters={filters}
                filterValues={filterValues}
                onFilterChange={(key, value) => {
                    setFilterValues((prev) => ({ ...prev, [key]: value }));
                    setPage(1);
                }}
                onClearFilters={handleClearFilters}
                headerActions={
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="flat"
                            startContent={<FileDownload size={16} />}
                        >
                            Exportar Excel
                        </Button>
                        <Button
                            size="sm"
                            color="primary"
                            startContent={<AddCircle size={16} />}
                        >
                            Nuevo Comando
                        </Button>
                        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
                            <Button
                                size="sm"
                                variant={viewMode === "table" ? "solid" : "light"}
                                color={viewMode === "table" ? "primary" : "default"}
                                isIconOnly
                                onPress={() => setViewMode("table")}
                                className="min-w-8 h-8"
                            >
                                <Widget size={16} />
                            </Button>
                            <Button
                                size="sm"
                                variant={viewMode === "cards" ? "solid" : "light"}
                                color={viewMode === "cards" ? "primary" : "default"}
                                isIconOnly
                                onPress={() => setViewMode("cards")}
                                className="min-w-8 h-8"
                            >
                                <ListArrowDown size={16} />
                            </Button>
                        </div>
                    </div>
                }
                sortDescriptor={sortDescriptor}
                onSortChange={(d) => {
                    setSortDescriptor(d);
                    setPage(1);
                }}
                viewMode={viewMode}
                page={page}
                pageSize={pageSize}
                totalRegistros={filteredData.length}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
                cardView={(item) => <CommandCard key={item.id} command={item} />}
                isLoading={false}
            />
        </PageContainer>
    );
}