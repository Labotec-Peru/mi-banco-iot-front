import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import type { Sensor } from "../types/sensor";
import SensorCard from "../components/SensorCard";
import { useSensors } from "../hooks/useSensors";
import ModalSensor from "../components/ModalSensor";
import ModalSensorInstallation from "../components/ModalSensorInstallation";
import { getSensorColumns } from "../components/SensorColumns";
import { getSensorFilters } from "../config/sensorFilters";
import StatsRow from "@/features/dashboard/components/StatsRow";
import { useWaterMeters } from "@/features/medidores/hooks/useWaterMeters";
import TableComponent, { type ViewMode } from "../../../components/ux/TableComponent";


export default function Sensores() {
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: "ascending" | "descending" }>({
        column: "serialNumber",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
    const [selectedSensorForInstall, setSelectedSensorForInstall] = useState<Sensor | null>(null);

    const {
        sensors,
        isLoading,
        error,
        create,
        update,
        refetch,
        setFilters,
        applyFilters
    } = useSensors();

    useWaterMeters();

    const filteredSensors = useMemo(() => {
        return applyFilters(filterValues);
    }, [sensors, filterValues, applyFilters]);

    const filteredSorted = useMemo(() => {
        let rows = [...filteredSensors];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof Sensor> = {
            'id': 'id',
            'serialNumber': 'serialNumber',
            'meterBrandId': 'meterBrandId',
            'meterModelId': 'meterModelId',
            'firmwareVersion': 'firmwareVersion',
            'status': 'status',
            'createdAt': 'createdAt',
            'updatedAt': 'updatedAt',
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
    }, [filteredSensors, sortDescriptor]);

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredSorted.slice(start, start + pageSize);
    }, [filteredSorted, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [filterValues]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilterValues({});
        setFilters({
            page: 0,
        });
        setPage(1);
    };

    const handleCreate = () => {
        setEditingSensor(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (sensor: Sensor) => {
        setEditingSensor(sensor);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleInstall = (sensor: Sensor) => {
        setSelectedSensorForInstall(sensor);
        setIsInstallModalOpen(true);
    };

    const handleModalSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (modalMode === 'create') {
                const result = await create(data);
                if (result.success) {
                    setIsModalOpen(false);
                    await refetch();
                }
            } else if (modalMode === 'edit' && editingSensor) {
                const result = await update(editingSensor.id, data);
                if (result.success) {
                    setIsModalOpen(false);
                    await refetch();
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };
    

    const handleExportExcel = () => {
        console.log("Exportar a Excel", filteredSorted);
    };

    if (error) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-danger">Error al cargar los sensores</div>
                    <Button color="primary" onPress={refetch}>
                        Reintentar
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const columns = getSensorColumns({
        onEdit: handleEdit,
        onInstall: handleInstall
    });

    return (
        <PageContainer>
            <div className="flex flex-col gap-4">
                <StatsRow />
                <TableComponent<Sensor>
                    data={paginated}
                    columns={columns}
                    idField="id"
                    filters={getSensorFilters()}
                    filterValues={filterValues}
                    isLoading={isLoading}
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
                                Nuevo sensor
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
                    totalRegistros={filteredSorted.length}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    onViewModeChange={setViewMode}
                    viewMode={viewMode}
                    cardView={(sensor) => (
                        <SensorCard
                            key={sensor.id}
                            sensor={sensor}
                            onEdit={handleEdit}
                        />
                    )}
                />
            </div>

            <ModalSensor
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                sensor={editingSensor}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
            />

            <ModalSensorInstallation
                isOpen={isInstallModalOpen}
                onOpenChange={setIsInstallModalOpen}
                onSuccess={() => refetch()}
                preselectedSensorId={selectedSensorForInstall?.id || null}
            />
        </PageContainer>
    );
}