import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/react";
import type { RangeValue, DateValue } from "@heroui/react";
import { AddCircle, FileDownload } from "@solar-icons/react";
import type { Lectura } from "../types/lectura";
import { useReadings } from "../hooks/useReadings";
import { useWaterMeters } from "@/features/medidores/hooks/useWaterMeters";
import ModalLectura from "../components/ModalLectura";
import { getLecturaColumns } from "../components/LecturaColumns";
import { getLecturaFilters } from "../config/lecturaFilters";
import FlowVolumeChart from "@/components/ux/ConsumptionChart";
import { getLocalTimeZone } from "@internationalized/date";
import TableComponent, { type ViewMode } from "../../../components/ux/TableComponent";
import { useChartData } from "../hooks/useChartData";
import { endOfDayInstant, startOfDayInstant } from "@/utils/date";

import { useChartReadings } from "../hooks/useChartReadings";
import PageContainer from "@/layouts/PageContainer";
import StatsRow from "@/features/dashboard/components/StatsRow";


export default function Lecturas() {
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({
        column: "readingDate",
        direction: "descending",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedWaterMeterId, setSelectedWaterMeterId] = useState<number | undefined>();

    const { waterMeters, isLoading: isLoadingMeters } = useWaterMeters();

    const {
        readings,
        pagination,
        isLoading,
        error,
        create,
        refetch,
        setFilters,
    } = useReadings();


    const {
        readings: chartReadings } = useChartReadings({
        waterMeterId: filterValues.waterMeterId
            ? Number(filterValues.waterMeterId)
            : undefined,
        startDate: filterValues.startDate,
        endDate: filterValues.endDate,
        enabled: viewMode === "chart",
    });

    const chartData = useChartData(chartReadings);

    const initializedMeterRef = useRef(false);
    useEffect(() => {
        if (isLoadingMeters) return;
        if (initializedMeterRef.current) return;
        if (waterMeters.length === 0) return;

        initializedMeterRef.current = true;

        if (!filterValues.waterMeterId) {
            const firstMeterId = waterMeters[0].id.toString();
            setFilterValues((prev) => ({
                ...prev,
                waterMeterId: firstMeterId,
            }));
        }
    }, [isLoadingMeters, waterMeters, filterValues.waterMeterId]);


    useEffect(() => {
        if (!filterValues.waterMeterId) return;

        const filters: any = {
            page: page - 1,
            size: pageSize,
            waterMeterId: Number(filterValues.waterMeterId),
        };

        if (filterValues.startDate) {
            filters.startDate = filterValues.startDate;
        }
        if (filterValues.endDate) {
            filters.endDate = filterValues.endDate;
        }

        if (filterValues.status) {
            filters.status = filterValues.status;
        }
        if (filterValues.search) {
            filters.search = filterValues.search;
        }

        setFilters(filters);
    }, [
        page,
        pageSize,
        filterValues.waterMeterId,
        filterValues.startDate,
        filterValues.endDate,
        filterValues.status,
        filterValues.search,
        setFilters,
    ]);

    useEffect(() => {
        if (dateRange?.start && dateRange?.end) {
            const startDate = dateRange.start.toDate(getLocalTimeZone());
            const endDate = dateRange.end.toDate(getLocalTimeZone());

            setFilterValues((prev) => ({
                ...prev,
                startDate: startOfDayInstant(startDate),
                endDate: endOfDayInstant(endDate),
            }));
        } else {
            setFilterValues((prev) => {
                const newFilters = { ...prev };
                delete newFilters.startDate;
                delete newFilters.endDate;
                return newFilters;
            });
        }
    }, [dateRange]);

    const sortedReadings = useMemo(() => {
        let rows = [...readings];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof Lectura> = {
            id: "id",
            waterMeterId: "waterMeterId",
            value: "value",
            consumption: "consumption",
            readingDate: "readingDate",
            status: "status",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
        };

        const column = columnMap[sortDescriptor.column];

        if (column) {
            rows.sort((a, b) => {
                const av = String(a[column] ?? "");
                const bv = String(b[column] ?? "");
                const cmp = av.localeCompare(bv);
                return sortDescriptor.direction === "ascending" ? cmp : -cmp;
            });
        }

        return rows;
    }, [readings, sortDescriptor]);

    useEffect(() => {
        setPage(1);
    }, [
        filterValues.waterMeterId,
        filterValues.startDate,
        filterValues.endDate,
        filterValues.status,
        filterValues.search,
    ]);

    const lecturaFilters = useMemo(() => {
        const baseFilters = getLecturaFilters();
        return baseFilters.map((filter) => {
            if (filter.key === "waterMeterId") {
                return {
                    ...filter,
                    options: waterMeters.map((meter) => ({
                        label: meter.serialNumber || `Medidor ${meter.id}`,
                        value: meter.id.toString(),
                    })),
                };
            }
            return filter;
        });
    }, [waterMeters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        const defaultMeterId = waterMeters.length > 0
            ? waterMeters[0].id.toString()
            : undefined;

        setFilterValues(
            defaultMeterId ? { waterMeterId: defaultMeterId } : {}
        );
        setDateRange(null);
        setPage(1);
    };

    const handleCreate = () => {
        setSelectedWaterMeterId(undefined);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const result = await create(data);
            if (result.success) {
                setIsModalOpen(false);
                await refetch();
            }
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExportExcel = () => {
        console.log("Exportar a Excel", sortedReadings);
    };

    const handleDateRangeChange = (range: RangeValue<DateValue> | null) => {
        setDateRange(range);
    };

    const renderCardView = (item: Lectura) => {
        return (
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4 border border-zinc-200 dark:border-zinc-700">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">Lectura #{item.id}</h3>
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${item.status === "ACTIVE"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                    >
                        {item.status}
                    </span>
                </div>
                <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                        <span className="text-default-500">Medidor:</span>
                        <span>{item.waterMeterId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-default-500">Valor:</span>
                        <span className="font-medium">{item.value}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-default-500">Consumo:</span>
                        <span>{item.consumption}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-default-500">Fecha:</span>
                        <span>{item.readingDate}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="text-danger">Error al cargar las lecturas</div>
                <Button color="primary" onPress={refetch}>
                    Reintentar
                </Button>
            </div>
        );
    }

    return (
        <PageContainer>
            <StatsRow />
            <div className="flex flex-col gap-4">
                <TableComponent<Lectura>
                    data={sortedReadings}
                    columns={getLecturaColumns({
                        onView: (lectura) => console.log("Ver lectura:", lectura),
                    })}
                    idField="id"
                    filters={lecturaFilters}
                    filterValues={filterValues}
                    isLoading={isLoading || isLoadingMeters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    headerActions={
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                color="primary"
                                startContent={<AddCircle size={16} />}
                                onPress={handleCreate}
                            >
                                Nueva lectura
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                startContent={<FileDownload size={16} />}
                                onPress={handleExportExcel}
                            >
                                Exportar Excel
                            </Button>
                        </div>
                    }
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    page={page}
                    pageSize={pageSize}
                    totalRegistros={pagination.totalElements}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    cardView={renderCardView}
                    chartComponent={<FlowVolumeChart data={chartData} />}
                    dateRangeValue={dateRange}
                    onDateRangeChange={handleDateRangeChange}
                    availableViews={["table", "chart"]}
                />
            </div>

            <ModalLectura
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
                waterMeterId={selectedWaterMeterId}
            />
        </PageContainer>
    );
}