import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
    Widget,
    ListArrowDown
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent from "../../../components/ux/TableComponent";
import type { TecnologiaRed } from "../types/tecnologiaRed";
import TecnologiaRedCard from "../components/TecnologiaRedCard";
import { useNetworkTechnologies } from "../hooks/useNetworkTechnologies";
import ModalTecnologiaRed from "../components/ModalTecnologiaRed";
import { getTecnologiaRedColumns } from "../components/TecnologiaRedColumns";
import { getTecnologiaRedFilters } from "../config/tecnologiaRedFilters";

import StatsRow from "@/features/dashboard/components/StatsRow";

type ViewMode = "table" | "cards";

export default function TecnologiasRed() {
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: "ascending" | "descending" }>({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingTecnologia, setEditingTecnologia] = useState<TecnologiaRed | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const {
        technologies,
        isLoading,
        error,
        create,
        update,
        remove,
        refetch,
        setFilters,
        applyFilters
    } = useNetworkTechnologies();

    const filteredTechnologies = useMemo(() => {
        return applyFilters(filterValues);
    }, [technologies, filterValues, applyFilters]);

    const filteredSorted = useMemo(() => {
        let rows = [...filteredTechnologies];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof TecnologiaRed> = {
            'id': 'id',
            'name': 'name',
            'abbreviation': 'abbreviation',
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
    }, [filteredTechnologies, sortDescriptor]);

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
        setEditingTecnologia(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (tecnologia: TecnologiaRed) => {
        setEditingTecnologia(tecnologia);
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
            } else if (modalMode === 'edit' && editingTecnologia) {
                const result = await update(editingTecnologia.id, data);
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

    const handleDelete = async (tecnologia: TecnologiaRed) => {
        try {
            const result = await remove(tecnologia.id);
            if (result.success) {
                await refetch();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleExportExcel = () => {
        console.log("Exportar a Excel", filteredSorted);
    };

    if (error) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-danger">Error al cargar las tecnologías de red</div>
                    <Button color="primary" onPress={refetch}>
                        Reintentar
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="flex flex-col gap-4">
                <StatsRow />
                <TableComponent<TecnologiaRed>
                    data={paginated}
                    columns={getTecnologiaRedColumns({ onEdit: handleEdit, onDelete: handleDelete })}
                    idField="id"
                    filters={getTecnologiaRedFilters()}
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
                                Nueva tecnología
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
                    cardView={(tecnologia) => (
                        <TecnologiaRedCard
                            key={tecnologia.id}
                            tecnologia={tecnologia}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />
            </div>

            <ModalTecnologiaRed
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                tecnologia={editingTecnologia}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
            />
        </PageContainer>
    );
}