import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { AddCircle } from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent from "../../../components/ux/TableComponent";
import type { Attachment } from "../services/attachmentApi";
import { useAttachments } from "../hooks/useAttachments";
import ModalAttachment from "../components/ModalAttachment";
import { getAttachmentColumns } from "../components/chmentColumns";
import { getAttachmentFilters } from "../config/attachmentFilters";

export default function Attachments() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});
    const [sortDescriptor, setSortDescriptor] = useState<{ 
        column: string; 
        direction: "ascending" | "descending" 
    }>({
        column: "created",
        direction: "descending",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const {
        attachments,
        isLoading,
        error,
        create,
        update,
        remove,
        refetch,
        setFilters,
        applyFilters,
    } = useAttachments();

    const filteredAttachments = useMemo(() => {
        return applyFilters(filterValues);
    }, [attachments, filterValues, applyFilters]);

    const filteredSorted = useMemo(() => {
        let rows = [...filteredAttachments];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof Attachment> = {
            'filename': 'filename',
            'fileType': 'fileType',
            'created': 'created',
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
    }, [filteredAttachments, sortDescriptor]);

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredSorted.slice(start, start + pageSize);
    }, [filteredSorted, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [filterValues]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        
        if (key === 'fileType') {
            setFilters({ [key]: value });
        }
    };

    const handleClearFilters = () => {
        setFilterValues({});
        setFilters({
            page: 0,
            size: pageSize,
        });
        setPage(1);
    };

    const handleCreate = () => {
        setSelectedAttachment(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (attachment: Attachment) => {
        setSelectedAttachment(attachment);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (attachment: Attachment) => {
        if (window.confirm(`¿Estás seguro de eliminar el archivo "${attachment.filename}"?`)) {
            await remove(attachment.id);
        }
    };

    const handleModalSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (modalMode === 'create') {
                await create(data);
            } else if (selectedAttachment) {
                await update(selectedAttachment.id, data);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error al guardar:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (error) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                    <div className="text-danger">Error al cargar los archivos</div>
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
                <TableComponent<Attachment>
                    data={paginated}
                    columns={getAttachmentColumns({
                        onEdit: handleEdit,
                        onDelete: handleDelete,
                    })}
                    idField="id"
                    filters={getAttachmentFilters()}
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
                                Subir Archivo
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
                />
            </div>

            <ModalAttachment
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                attachment={selectedAttachment}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
            />
        </PageContainer>
    );
}