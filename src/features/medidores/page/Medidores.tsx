import { useMemo, useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { 
    AddCircle, 
    FileDownload, 
    Widget, 
    ListArrowDown 
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent from "../../../components/ux/TableComponent";
import type { Medidor } from "../types/medidor";
import MedidorCard from "../components/MedidorCard";
import StatsRow from "../../dashboard/components/StatsRow";
import ModalMedidores from "../components/ModalMedidores";
import { useWaterMeters } from "../hooks/useWaterMeters";
import { mapApiToMedidor } from "../services/medidorMapper";
import { getMedidorColumns } from "../components/MedidorColumns";
import { getMedidorFilters } from "../config/medidorFilters";
import { exportMedidoresToExcel } from "../config/medidorExport";

type ViewMode = "table" | "cards";

export default function Medidores() {
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
    const [editingMedidor, setEditingMedidor] = useState<Medidor | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const { 
        waterMeters, 
        isLoading, 
        error,
        setFilters,
        create,
        update,
        remove,
        refetch 
    } = useWaterMeters();

    useEffect(() => {
        setFilters({
            page: page - 1,
            size: pageSize,
            serialNumber: filterValues.search || undefined,
        });
    }, [page, pageSize, filterValues.search, setFilters]);

    const mappedData = useMemo(() => {
        return waterMeters.map((apiMeter) => mapApiToMedidor(apiMeter));
    }, [waterMeters]);

    const filteredSorted = useMemo(() => {
        let rows = [...mappedData];

        if (filterValues.tipoMedidor) {
            rows = rows.filter((m) => m.tipoMedidor === filterValues.tipoMedidor);
        }
        if (filterValues.estado) {
            rows = rows.filter((m) => m.estado === filterValues.estado);
        }

        rows.sort((a, b) => {
            const av = String(a[sortDescriptor.column as keyof Medidor] ?? "");
            const bv = String(b[sortDescriptor.column as keyof Medidor] ?? "");
            const cmp = av.localeCompare(bv);
            return sortDescriptor.direction === "ascending" ? cmp : -cmp;
        });

        return rows;
    }, [mappedData, filterValues, sortDescriptor]);

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredSorted.slice(start, start + pageSize);
    }, [filteredSorted, page, pageSize]);


    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleClearFilters = () => {
        setFilterValues({});
        setPage(1);
    };

    const handleCreate = () => {
        setEditingMedidor(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (medidor: Medidor) => {
        setEditingMedidor(medidor);
        setModalMode('edit');
        setIsModalOpen(true);
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
            } else if (modalMode === 'edit' && editingMedidor) {
                const apiMeter = waterMeters.find(m => m.serialNumber === editingMedidor.numeroSerie);
                if (apiMeter) {
                    const result = await update(apiMeter.id, data);
                    if (result.success) {
                        setIsModalOpen(false);
                        await refetch();
                    }
                }
            }
        } catch (error) {
            console.error("Error al guardar:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (medidor: Medidor) => {
        try {
            const apiMeter = waterMeters.find(m => m.serialNumber === medidor.numeroSerie);
            if (apiMeter) {
                const result = await remove(apiMeter.id);
                if (result.success) {
                    await refetch();
                }
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleExportExcel = () => {
        exportMedidoresToExcel(filteredSorted);
    };



    if (error) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-danger">Error al cargar los medidores</div>
                    <Button color="primary" onPress={refetch}>
                        Reintentar
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <StatsRow />
            <div className="flex flex-col gap-4">
                <TableComponent<Medidor>
                    data={paginated}
                    columns={getMedidorColumns({ onEdit: handleEdit, onDelete: handleDelete })}
                    idField="id"
                    filters={getMedidorFilters()}
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
                                Nuevo medidor
                            </Button>
                            <Button 
                                size="sm" 
                                variant="flat" 
                                startContent={<FileDownload size={16} />} 
                                onPress={handleExportExcel}
                            >
                                Exportar Excel
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
                    onSortChange={setSortDescriptor}
                    page={page}
                    pageSize={pageSize}
                    totalRegistros={filteredSorted.length}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    viewMode={viewMode}
                    cardView={(medidor) => (
                        <MedidorCard
                            key={medidor.id}
                            medidor={medidor}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />
            </div>

            <ModalMedidores
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                medidor={editingMedidor}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
            />
        </PageContainer>
    );
}