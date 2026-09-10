import { useEffect, useMemo, useState } from "react";
import { Button } from "@heroui/react";
import { AddCircle } from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent from "../../../components/ux/TableComponent";
import type { User } from "../services/userApi";
import { useUsers } from "../hooks/useUsers";
import ModalUser from "../components/ModalUser";
import { getUserColumns } from "../components/UserColumns";
import { getUserFilters } from "../config/userFilters";

export default function Users() {
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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const {
        users,
        isLoading,
        error,
        create,
        update,
        remove,
        refetch,
        setFilters,
        applyFilters,
    } = useUsers();

    const filteredUsers = useMemo(() => {
        return applyFilters(filterValues);
    }, [users, filterValues, applyFilters]);

    const filteredSorted = useMemo(() => {
        let rows = [...filteredUsers];

        if (rows.length === 0) return rows;

        const columnMap: Record<string, keyof User> = {
            'user': 'firstName',
            'documentNumber': 'documentNumber',
            'status': 'status',
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
    }, [filteredUsers, sortDescriptor]);

    const paginated = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredSorted.slice(start, start + pageSize);
    }, [filteredSorted, page, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [filterValues]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        
        if (key === 'status' || key === 'role') {
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
        setSelectedUser(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (user: User) => {
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${user.firstName} ${user.lastName}?`)) {
            await remove(user.id);
        }
    };

    const handleModalSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (modalMode === 'create') {
                await create(data);
            } else if (selectedUser) {
                await update(selectedUser.id, data);
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
                    <div className="text-danger">Error al cargar los usuarios</div>
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
                <TableComponent<User>
                    data={paginated}
                    columns={getUserColumns({
                        onEdit: handleEdit,
                        onDelete: handleDelete,
                    })}
                    idField="id"
                    filters={getUserFilters()}
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
                                Nuevo Usuario
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

            <ModalUser
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                user={selectedUser}
                mode={modalMode}
                onSubmit={handleModalSubmit}
                isLoading={isSubmitting}
            />
        </PageContainer>
    );
}