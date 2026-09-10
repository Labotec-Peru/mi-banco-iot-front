import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
    Widget,
    ListArrowDown,
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent from "../../../components/ux/TableComponent";
import type { Company } from "../types/company";
import CompanyCard from "../components/CompanyCard";
import ModalCompanies from "../components/ModalCompanies";
import { useCompanies } from "../hooks/useCompanies";
import { getCompanyColumns } from "../components/CompanyColumns";
import { getCompanyFilters } from "../config/companyFilters";

type ViewMode = "table" | "cards";

export default function Companies() {
    const [viewMode, setViewMode] = useState<ViewMode>("table");
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({
        column: "name",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");

    const {
        companies,
        pagination,
        isLoading,
        error,
        setFilters,
        create,
        update,
        remove,
        refetch,
    } = useCompanies();

    useEffect(() => {
        setFilters({
            page: page - 1,
            size: pageSize,
            name: filterValues.search || undefined,
            status: filterValues.status || undefined,
        });
    }, [page, pageSize, filterValues.search, filterValues.status, setFilters]);


    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const handleClearFilters = () => {
        setFilterValues({});
        setPage(1);
    };

    const handleCreate = () => {
        setEditingCompany(null);
        setModalMode("create");
        setIsModalOpen(true);
    };

    const handleEdit = (company: Company) => {
        setEditingCompany(company);
        setModalMode("edit");
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (modalMode === "create") {
                const result = await create(data);
                if (result.success) {
                    setIsModalOpen(false);
                    await refetch();
                }
            } else if (modalMode === "edit" && editingCompany) {
                const result = await update(editingCompany.id, data);
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

    const handleDelete = async (company: Company) => {
        try {
            const result = await remove(company.id);
            if (result.success) {
                await refetch();
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    const handleExportExcel = () => {
    };

    if (error) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-danger">Error al cargar las empresas</div>
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
                <TableComponent<Company>

                    data={companies}
                    columns={getCompanyColumns({ onEdit: handleEdit, onDelete: handleDelete })}
                    idField="id"
                    filters={getCompanyFilters()}
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
                                Nueva empresa
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
                    totalRegistros={pagination.totalElements}
                    onPageChange={setPage}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPage(1);
                    }}
                    viewMode={viewMode}
                    cardView={(company) => (
                        <CompanyCard
                            key={company.id}
                            company={company}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />
            </div>

            <ModalCompanies
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                company={editingCompany}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
            />
        </PageContainer>
    );
}