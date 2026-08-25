import { useMemo, useState } from "react";
import TableComponent, { type CustomColumnDef, type FilterFieldDef } from "../../../components/ux/TableComponent";
import { Chip, Button, Tooltip, type PressEvent } from "@heroui/react";
import { AddCircle, ClockCircle, FileDownload, ListArrowDown, Widget } from "@solar-icons/react";
import SerieCard from "../components/SerieCard";
import { ESTADO_SERIE_CONFIG, formatRelativeTime, type SerieEquipo } from "../types/serie";
import { MOCK_SERIES } from "../services/seriesMock";

const PAGE_SIZE_DEFAULT = 15;
type ViewMode = "table" | "cards";
export default function SeriesTabla() {
    const [data] = useState<SerieEquipo[]>(MOCK_SERIES);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({ serie: "", estado: "" });
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: "ascending" | "descending" }>({
        column: "ultimaConexion",
        direction: "descending",
    });

    const filtered = useMemo(() => {
        let rows = [...data];
        if (filterValues.serie) {
            const q = filterValues.serie.toLowerCase();
            rows = rows.filter((s) => s.serie.toLowerCase().includes(q) || s.medidorInstalado?.toLowerCase().includes(q));
        }
        if (filterValues.estado) {
            rows = rows.filter((s) => s.estado === filterValues.estado);
        }
        rows.sort((a, b) => {
            const av = String(a[sortDescriptor.column as keyof SerieEquipo] ?? "");
            const bv = String(b[sortDescriptor.column as keyof SerieEquipo] ?? "");
            const cmp = av.localeCompare(bv);
            return sortDescriptor.direction === "ascending" ? cmp : -cmp;
        });
        return rows;
    }, [data, filterValues, sortDescriptor]);

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filtered.slice(start, start + pageSize);
    }, [filtered, page, pageSize]);

    const handleViewHistory = (serie: SerieEquipo) => {
        console.log("Ver historial de", serie.serie);
    };

    const columns: CustomColumnDef<SerieEquipo>[] = useMemo(
        () => [
            {
                key: "serie",
                label: "Serie",
                width: 190,
                sticky: true,
                render: (item) => <span className="font-semibold  font-mono text-xs">{item.serie}</span>,
            },
            {
                key: "marca",
                label: "Marca / Modelo",
                width: 180,
                render: (item) => (
                    <div className="flex flex-col leading-tight">
                        <span className="font-medium ">{item.marca}</span>
                        <span className="text-[11px] ">{item.modelo}</span>
                    </div>
                ),
            },
            { key: "firmware", label: "Firmware", width: 100 },
            {
                key: "ultimaConexion",
                label: "Última conexión",
                width: 140,
                render: (item) => (
                    <span >
                        {formatRelativeTime(item.ultimaConexion)}
                    </span>
                ),
            },
            {
                key: "estado",
                label: "Estado",
                width: 130,
                align: "center",
                render: (item) => {
                    const cfg = ESTADO_SERIE_CONFIG[item.estado];
                    return (
                        <Chip
                            size="sm"
                            variant="flat"
                            color={cfg.color}
                            startContent={<span className={`ml-1.5 h-1.5 w-1.5 rounded-full ${cfg.dot}`} />}
                            classNames={{ content: "px-1 text-[11px] font-medium" }}
                        >
                            {cfg.label}
                        </Chip>
                    );
                },
            },
            {
                key: "medidorInstalado",
                label: "Medidor instalado",
                width: 150,
                render: (item) =>
                    item.medidorInstalado ? (
                        <span className="font-mono text-xs font-medium text-primary">#{item.medidorInstalado}</span>
                    ) : (
                        <span className="text-slate-300">—</span>
                    ),
            },
            {
                key: "acciones",
                label: "",
                width: 60,
                sortable: false,
                align: "center",
                render: (item) => (
                    <Tooltip content="Ver historial" size="sm">
                        <Button isIconOnly size="sm" variant="flat" radius="full" onPress={() => handleViewHistory(item)}>
                            <ClockCircle size={14} className="text-default-500" />
                        </Button>
                    </Tooltip>
                ),
            },
        ],
        []
    );

    const filters: FilterFieldDef[] = [
        { key: "serie", type: "text", placeholder: "Buscar serie o medidor" },
        {
            key: "estado",
            type: "select",
            placeholder: "Estado",
            options: Object.entries(ESTADO_SERIE_CONFIG).map(([value, cfg]) => ({ value, label: cfg.label })),
        },
    ];

    function handleExportExcel(e: PressEvent): void {
        throw new Error("Function not implemented.");
    }

    function handleCreate(e: PressEvent): void {
        throw new Error("Function not implemented.");
    }



    return (
        <TableComponent
            data={paginated}
            columns={columns}
            idField="id"
            filters={filters}
            filterValues={filterValues}
            onFilterChange={(key, value) => {
                setFilterValues((prev) => ({ ...prev, [key]: value }));
                setPage(1);
            }}
            onClearFilters={() => {
                setFilterValues({ serie: "", estado: "" });
                setPage(1);
            }}
            headerActions={
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="flat" startContent={<FileDownload size={16} />} onPress={handleExportExcel}>
                        Exportar Excel
                    </Button>
                    <Button size="sm" color="primary" startContent={<AddCircle size={16} />} onPress={handleCreate}>
                        Nuevo Sensor
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
            totalRegistros={filtered.length}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
            }}
            cardView={(serie) => <SerieCard key={serie.id} serie={serie} onViewHistory={handleViewHistory} />}
        />
    );
}