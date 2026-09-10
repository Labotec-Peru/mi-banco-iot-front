import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import type { Tipo } from "../types/tipo";
import TipoCard from "../components/TipoCard";
import { useMeterTypes } from "../hooks/useMeterTypes";
import ModalTipos from "../components/ModalTipos";
import { getTipoColumns } from "../components/TipoColumns";
import { getTipoFilters } from "../config/tipoFilters";
import StatsRow from "@/features/dashboard/components/StatsRow";
import TableComponent, { type ViewMode } from "../../../components/ux/TableComponent";
export default function Tipos() {
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
    const [editingTipo, setEditingTipo] = useState<Tipo | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const {
        types,
        isLoading,
        error,
        create,
        update,
        remove,
        refetch,
        setFilters,
        applyFilters
    } = useMeterTypes();

    const filteredTypes = useMemo(() => {
        return applyFilters(filterValues);
    }, [types, filterValues, applyFilters]);

    const filteredSorted = useMemo(() => {
        let rows = [...filteredTypes];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof Tipo> = {
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
    }, [filteredTypes, sortDescriptor]);

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
        setEditingTipo(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (tipo: Tipo) => {
        setEditingTipo(tipo);
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
            } else if (modalMode === 'edit' && editingTipo) {
                const result = await update(editingTipo.id, data);
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

    const handleDelete = async (tipo: Tipo) => {
        try {
            const result = await remove(tipo.id);
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
                    <div className="text-danger">Error al cargar los tipos</div>
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
                <TableComponent<Tipo>
                    data={paginated}
                    columns={getTipoColumns({ onEdit: handleEdit, onDelete: handleDelete })}
                    idField="id"
                    filters={getTipoFilters()}
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
                                Nuevo tipo
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
                    viewMode={viewMode}
                       onViewModeChange={setViewMode}
                    cardView={(tipo) => (
                        <TipoCard
                            key={tipo.id}
                            tipo={tipo}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                    
                />
            </div>

            <ModalTipos
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                tipo={editingTipo}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
            />
        </PageContainer>
    );
}