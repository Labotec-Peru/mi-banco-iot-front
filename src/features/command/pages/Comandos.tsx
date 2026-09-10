// pages/Comandos.tsx
import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import {
    AddCircle,
    FileDownload,
} from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent from "../../../components/ux/TableComponent";
import type { Comando } from "../types/comando";
import { useCommands } from "../hooks/useCommands";
import ModalComando from "../components/ModalComando";
import { getComandoColumns } from "../components/ComandoColumns";
import { getComandoFilters } from "../config/comandoFilters";
import StatsRow from "@/features/dashboard/components/StatsRow";

export default function Comandos() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: "ascending" | "descending" }>({
        column: "createdAt",
        direction: "descending",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedWaterMeterId, setSelectedWaterMeterId] = useState<number | undefined>();
    const [, setViewingComando] = useState<Comando | null>(null);

    const {
        commands,
        isLoading,
        error,
        create,
        updateStatus,
        refetch,
        setFilters,
        applyFilters,
    } = useCommands();

    const filteredCommands = useMemo(() => {
        return applyFilters(filterValues);
    }, [commands, filterValues, applyFilters]);

    const filteredSorted = useMemo(() => {
        let rows = [...filteredCommands];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof Comando> = {
            'id': 'id',
            'waterMeterId': 'waterMeterId',
            'type': 'type',
            'status': 'status',
            'priority': 'priority',
            'retryCount': 'retryCount',
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
    }, [filteredCommands, sortDescriptor]);

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

    const handleUpdateStatus = async (comando: Comando, status: string) => {
        const result = await updateStatus(comando.id, status);
        if (result.success) {
            await refetch();
        }
    };

    const handleExportExcel = () => {
        console.log("Exportar a Excel", filteredSorted);
    };

    if (error) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-danger">Error al cargar los comandos</div>
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
                <TableComponent<Comando>
                    data={paginated}
                    columns={getComandoColumns({
                        onView: (comando) => setViewingComando(comando),
                        onUpdateStatus: handleUpdateStatus,
                    })}
                    idField="id"
                    filters={getComandoFilters()}
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
                                Nuevo comando
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
                    availableViews={["table"]}
                />
            </div>

            <ModalComando
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
                waterMeterId={selectedWaterMeterId}
            />
        </PageContainer>
    );
}