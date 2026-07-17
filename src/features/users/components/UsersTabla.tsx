import { useState, useMemo } from "react";
import TableComponent, {
    type CustomColumnDef,
    type FilterFieldDef,
} from "../../../components/ux/TableComponent";
import { useGetUsersQuery } from "../services/userApi";
import type { UserItem } from "../services/userApi";
import { Avatar, Chip } from "@heroui/react";

const PAGE_SIZE_DEFAULT = 15;

export default function UsersTabla() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({
        usu_usuario: "",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({ column: "usu_usuario", direction: "ascending" });

    const { data, isLoading, isFetching } = useGetUsersQuery();

    const allUsers = data?.data ?? [];
    const filteredUsers = useMemo(() => {
        return allUsers.filter((user) => {
            const searchTerm = filterValues.usu_usuario?.toLowerCase() || "";
            if (!searchTerm) return true;

            return (
                user.usu_usuario?.toLowerCase().includes(searchTerm) ||
                user.usu_nombre?.toLowerCase().includes(searchTerm) ||
                user.usu_correo?.toLowerCase().includes(searchTerm) ||
                user.usu_telefono?.toLowerCase().includes(searchTerm) ||
                user.usu_cargo?.toLowerCase().includes(searchTerm)
            );
        });
    }, [allUsers, filterValues.usu_usuario]);

    const sortedUsers = useMemo(() => {
        return [...filteredUsers].sort((a, b) => {
            const col = sortDescriptor.column as keyof UserItem;
            const aVal = String(a[col] ?? "").toLowerCase();
            const bVal = String(b[col] ?? "").toLowerCase();

            if (aVal < bVal) return sortDescriptor.direction === "ascending" ? -1 : 1;
            if (aVal > bVal) return sortDescriptor.direction === "ascending" ? 1 : -1;
            return 0;
        });
    }, [filteredUsers, sortDescriptor]);

    const totalRegistros = sortedUsers.length;

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedUsers.slice(start, start + pageSize);
    }, [sortedUsers, page, pageSize]);

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const columns: CustomColumnDef<UserItem>[] = useMemo(
        () => [
            {
                key: "usu_nombre",
                label: "Nombre",
                width: 200,
                sticky: true,
                render: (item) => (
                    <div className="flex items-center gap-2">
                        <Avatar
                            size="sm"
                            name={item.usu_nombre}
                            src={`https://ui-avatars.com/api/?name=${item.usu_nombre}&background=%231e187b&size=32&color=fff&bold=true`}
                            className="shrink-0"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-slate-700">{item.usu_nombre}</span>
                            <span className="text-[11px] text-slate-400">{item.usu_correo}</span>
                        </div>
                    </div>
                ),
            },
            { key: "usu_telefono", label: "Teléfono", width: 130 },
            { key: "usu_cargo", label: "Cargo", width: 130 },
            {
                key: "usu_usuario",
                label: "Usuario",
                width: 200,
                sticky: true,
                render: (item) => (
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-slate-700">{item.usu_usuario}</span>
                            <span className="text-[11px] text-slate-400">{item.usu_tipo}</span>
                        </div>
                    </div>
                ),
            },
            {
                key: "usu_estado",
                label: "Estado",
                width: 130,
                align: "center",
                render: (item) => {
                    const estado = item.usu_estado?.toLowerCase();
                    const map: Record<string, "success" | "danger" | "warning" | "default"> = {
                        activo: "success",
                        inactivo: "danger",
                        desconocido: "warning",
                    };
                    return (
                        <Chip size="sm" variant="solid" color={map[estado] ?? "default"}>
                            {item.usu_estado}
                        </Chip>
                    );
                },
            },
        ],
        []
    );

    const filters: FilterFieldDef[] = [
        { key: "usu_usuario", type: "text", placeholder: "Buscar usuario..." },
    ];

    return (
        <TableComponent
            data={paginatedUsers}  
            columns={columns}
            idField="usu_id"
            filters={filters}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            onClearFilters={() => {
                setFilterValues({ usu_usuario: "" });
                setPage(1);
            }}
            sortDescriptor={sortDescriptor}
            onSortChange={(d) => {
                setSortDescriptor(d);
                setPage(1);
            }}
            page={page}
            pageSize={pageSize}
            totalRegistros={totalRegistros}  
            onPageChange={setPage}
            onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
            }}
            isLoading={isLoading || isFetching}
        />
    );
}