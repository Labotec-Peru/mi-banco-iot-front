import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Spinner } from "@heroui/react";
import type { RangeValue, DateValue } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { AddCircle, FileDownload, Magnifer } from "@solar-icons/react";
import { useWaterMeters } from "@/features/medidores/hooks/useWaterMeters";
import ModalLectura from "../components/ModalLectura";
import { getLecturaFilters } from "../config/lecturaFilters";
import FlowVolumeChart from "@/components/ux/FlowVolumeChart";
import { getLocalTimeZone } from "@internationalized/date";
import { useChartData } from "../hooks/useChartData";
import { endOfDayInstant, startOfDayInstant } from "@/utils/date";
import { useChartReadings } from "../hooks/useChartReadings";
import { useReadings } from "../hooks/useReadings";
import PageContainer from "@/layouts/PageContainer";
import StatsRow from "@/features/dashboard/components/StatsRow";
import CustomDateRangePicker from "@/components/ux/CustomDateRangePicker";

export default function Lecturas() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null);

    const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedWaterMeterId, setSelectedWaterMeterId] = useState<number | undefined>();

    const { waterMeters, isLoading: isLoadingMeters } = useWaterMeters();

    const { create, refetch } = useReadings();

    const {
        readings: chartReadings,
        isFetching: isFetchingChart,
    } = useChartReadings({
        waterMeterId: appliedFilters.waterMeterId
            ? Number(appliedFilters.waterMeterId)
            : undefined,
        startDate: appliedFilters.startDate,
        endDate: appliedFilters.endDate,
        enabled: true,
    });

    const chartData = useChartData(
        chartReadings,
        appliedFilters.startDate,
        appliedFilters.endDate
    );

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
            setAppliedFilters((prev) => ({
                ...prev,
                waterMeterId: firstMeterId,
            }));
        }
    }, [isLoadingMeters, waterMeters, filterValues.waterMeterId]);

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

    const handleSearch = () => {
        setAppliedFilters({ ...filterValues });
    };

    const handleClearFilters = () => {
        const defaultMeterId = waterMeters.length > 0
            ? waterMeters[0].id.toString()
            : undefined;

        const cleared: Record<string, string> = defaultMeterId
            ? { waterMeterId: defaultMeterId }
            : {};

        setFilterValues(cleared);
        setAppliedFilters(cleared);
        setDateRange(null);
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



    return (
        <PageContainer>
            <StatsRow />

            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {lecturaFilters.map((filter) => {
                        if (filter.key === "waterMeterId") {
                            return (
                                <Autocomplete
                                    key={filter.key}
                                    label={filter.placeholder}
                                    placeholder="Buscar medidor..."
                                    className="max-w-xs"
                                    size="sm"
                                    selectedKey={filterValues.waterMeterId ?? null}
                                    onSelectionChange={(key) => {
                                        setFilterValues((prev) => ({
                                            ...prev,
                                            waterMeterId: key ? String(key) : "",
                                        }));
                                    }}
                                    isClearable
                                    allowsCustomValue={false}
                                >
                                    {(filter.options ?? []).map((opt) => (
                                        <AutocompleteItem key={opt.value} textValue={opt.label}>
                                            {opt.label}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                            );
                        }

                        if (filter.key === "dateRange" || filter.type === "dateRange") {
                            return (
                                <CustomDateRangePicker
                                    key={filter.key}
                                    value={dateRange}
                                    onChange={setDateRange}
                                    placeholder={filter.placeholder ?? "Rango de fechas"}
                                    className="w-66"
                                />
                            );
                        }

                        return null;
                    })}

                    <Button
                        size="sm"
                        color="primary"
                        startContent={<Magnifer size={16} weight="Bold" />}
                        onPress={handleSearch}
                        isLoading={isFetchingChart}
                        isDisabled={isFetchingChart}
                    >
                        Buscar
                    </Button>

                    <Button size="sm" variant="flat" onPress={handleClearFilters}>
                        Limpiar
                    </Button>
                </div>

                <FlowVolumeChart data={chartData} />
            </div>

            <ModalLectura
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
                waterMeterId={selectedWaterMeterId}
            />
        </PageContainer >
    );
}