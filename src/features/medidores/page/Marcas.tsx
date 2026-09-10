import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import type { Marca } from "../types/marca";
import MarcaCard from "../components/MarcaCard";
import ModalMarcas from "../components/ModalMarcas";
import { useMeterBrands } from "../hooks/useMeterBrands";
import { useCompanies } from "@/features/company/hooks/useCompanies";
import { getMarcaColumns } from "../components/MarcaColumns";
import { getMarcaFilters } from "../config/marcaFilters";
import type { SelectOption } from "../components/MarcaFormFields";
import StatsRow from "@/features/dashboard/components/StatsRow";
import TableComponent, { type ViewMode } from "../../../components/ux/TableComponent";



export default function Marcas() {
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
    const [editingMarca, setEditingMarca] = useState<Marca | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const {
        brands,
        isLoading,
        error,
        create,
        update,
        remove,
        refetch,
        applyFilters
    } = useMeterBrands();

    const {
        companies,
        isLoading: isLoadingCompanies
    } = useCompanies();

    const companyOptions: SelectOption[] = useMemo(() => {
        const options = companies.map((company: { id: any; name: any; }) => ({
            value: company.id,
            label: company.name,
        }));

        return [
            ...options,
        ];
    }, [companies]);

    const filteredBrands = useMemo(() => {
        return applyFilters(filterValues);
    }, [brands, filterValues, applyFilters]);
    const filteredSorted = useMemo(() => {
        let rows = [...filteredBrands];

        rows.sort((a, b) => {
            const av = String(a[sortDescriptor.column as keyof Marca] ?? "");
            const bv = String(b[sortDescriptor.column as keyof Marca] ?? "");
            const cmp = av.localeCompare(bv);
            return sortDescriptor.direction === "ascending" ? cmp : -cmp;
        });

        return rows;
    }, [filteredBrands, sortDescriptor]);

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
        setEditingMarca(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (marca: Marca) => {
        setEditingMarca(marca);
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
            } else if (modalMode === 'edit' && editingMarca) {
                const result = await update(editingMarca.id, data);
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

    const handleDelete = async (marca: Marca) => {
        try {
            const result = await remove(marca.id);
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
                    <div className="text-danger">Error al cargar las marcas</div>
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
                <TableComponent<Marca>
                    data={paginated}
                    columns={getMarcaColumns({ onEdit: handleEdit, onDelete: handleDelete })}
                    idField="id"
                    filters={getMarcaFilters()}
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
                                Nueva marca
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
                    cardView={(marca) => (
                        <MarcaCard
                            key={marca.id}
                            marca={marca}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                    availableViews={["table", "cards"]}
                />
            </div>

            <ModalMarcas
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                marca={editingMarca}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
                companies={companyOptions}
                isLoadingCompanies={isLoadingCompanies}
            />
        </PageContainer>
    );
}