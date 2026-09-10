import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import type { Modelo } from "../types/modelo";
import ModeloCard from "../components/ModeloCard";
import { useMeterModels } from "../hooks/useMeterModels";
import { useMeterBrands } from "../hooks/useMeterBrands";
import ModalModelos from "../components/ModalModelos";
import { getModeloColumns } from "../components/ModeloColumns";
import { getModeloFilters } from "../config/modeloFilters";
import type { SelectOption } from "../components/ModeloFormFields";
import StatsRow from "@/features/dashboard/components/StatsRow";

import TableComponent, { type ViewMode } from "../../../components/ux/TableComponent";


export default function Modelos() {
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
    const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const {
        models,
        isLoading,
        error,
        create,
        update,
        remove,
        refetch,
        setFilters,
        applyFilters
    } = useMeterModels();

    const {
        brands,
        isLoading: isLoadingBrands
    } = useMeterBrands();

    const brandOptions: SelectOption[] = useMemo(() => {
        if (!brands || brands.length === 0) {
            return [{ value: "", label: "No hay marcas disponibles" }];
        }

        const options = brands.map((brand: any) => ({
            value: String(brand.id),
            label: brand.name,
        }));

        return [
            ...options,
        ];
    }, [brands]);

    const filteredModels = useMemo(() => {
        return applyFilters(filterValues);
    }, [models, filterValues, applyFilters]);

    const filteredSorted = useMemo(() => {
        let rows = [...filteredModels];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof (typeof rows)[number]> = {
            'id': 'id',
            'name': 'name',
            'description': 'description',
            'meterBrandId': 'meterBrandId',
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
    }, [filteredModels, sortDescriptor]);

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredSorted.slice(start, start + pageSize).map((model): Modelo => ({
            ...model,
            brandId: model.meterBrandId,
            brandName: brands?.find((brand: any) => brand.id === model.meterBrandId)?.name ?? "",
        }));
    }, [filteredSorted, page, pageSize, brands]);

    useEffect(() => {
        setPage(1);
    }, [filterValues]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));

        if (key === 'meterBrandId' && value) {
            setFilters({
                meterBrandId: Number(value),
                page: 0,
            });
        } else if (key === 'meterBrandId' && !value) {
            setFilters({
                meterBrandId: undefined,
                page: 0,
            });
        }
    };

    const handleClearFilters = () => {
        setFilterValues({});
        setFilters({
            meterBrandId: undefined,
            page: 0,
        });
        setPage(1);
    };


    const handleCreate = () => {
        setEditingModelo(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (modelo: Modelo) => {
        setEditingModelo(modelo);
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
            } else if (modalMode === 'edit' && editingModelo) {
                const result = await update(editingModelo.id, data);
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

    const handleDelete = async (modelo: Modelo) => {
        try {
            const result = await remove(modelo.id);
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
                    <div className="text-danger">Error al cargar los modelos</div>
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
                <TableComponent<Modelo>
                    data={paginated}
                    columns={getModeloColumns({ onEdit: handleEdit, onDelete: handleDelete })}
                    idField="id"
                    filters={getModeloFilters()}
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
                                Nuevo modelo
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
                    cardView={(modelo) => (
                        <ModeloCard
                            key={modelo.id}
                            modelo={modelo}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                    availableViews={["table", "cards"]}
                />
            </div>

            <ModalModelos
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                modelo={editingModelo}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
                brands={brandOptions}
                isLoadingBrands={isLoadingBrands}
            />
        </PageContainer>
    );
}