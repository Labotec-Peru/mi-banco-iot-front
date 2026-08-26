import { useState, useMemo } from "react";
import TableComponent, {
    type CustomColumnDef,
    type FilterFieldDef,
} from "../../../components/ux/TableComponent";
import { Avatar, Chip } from "@heroui/react";

const PAGE_SIZE_DEFAULT = 15;

type UserItem = {
    usu_id: string;
    usu_usuario: string;
    usu_nombre: string;
    usu_correo: string;
    usu_telefono: string;
    usu_cargo: string;
    usu_tipo: string;
    usu_estado: string;
};

const MOCK_USERS: UserItem[] = [
    {
        usu_id: "1",
        usu_usuario: "jperez",
        usu_nombre: "Jorge Pérez",
        usu_correo: "jperez@empresa.com",
        usu_telefono: "987654321",
        usu_cargo: "Supervisor",
        usu_tipo: "Admin",
        usu_estado: "Activo",
    },
    {
        usu_id: "2",
        usu_usuario: "mrios",
        usu_nombre: "María Ríos",
        usu_correo: "mrios@empresa.com",
        usu_telefono: "912345678",
        usu_cargo: "Analista",
        usu_tipo: "Estándar",
        usu_estado: "Activo",
    },
    {
        usu_id: "3",
        usu_usuario: "lcastro",
        usu_nombre: "Luis Castro",
        usu_correo: "lcastro@empresa.com",
        usu_telefono: "998877665",
        usu_cargo: "Técnico",
        usu_tipo: "Estándar",
        usu_estado: "Inactivo",
    },
    {
        usu_id: "4",
        usu_usuario: "acruz",
        usu_nombre: "Ana Cruz",
        usu_correo: "acruz@empresa.com",
        usu_telefono: "955443322",
        usu_cargo: "Coordinadora",
        usu_tipo: "Admin",
        usu_estado: "Activo",
    },
    {
        usu_id: "5",
        usu_usuario: "dvega",
        usu_nombre: "Diego Vega",
        usu_correo: "dvega@empresa.com",
        usu_telefono: "944556677",
        usu_cargo: "Técnico",
        usu_tipo: "Estándar",
        usu_estado: "Desconocido",
    },
];
// ------------------------------------------------------------------------

export default function UsersTablaMock() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({
        usu_usuario: "",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({ column: "usu_usuario", direction: "ascending" });

    // En vez de useGetUsersQuery, usamos el arreglo mock directamente
    const isLoading = false;
    const isFetching = false;
    const allUsers = MOCK_USERS;

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
                            src={`https://ui-avatars.com/api/?name=${item.usu_nombre}&background=00A64F&size=32&color=fff&bold=true`}
                            className="shrink-0"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-foreground">
                                {item.usu_nombre}
                            </span>
                            <span className="text-[11px] text-default-500">
                                {item.usu_correo}
                            </span>
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
                            <span className="font-semibold text-foreground">
                                {item.usu_usuario}
                            </span>
                            <span className="text-[11px] text-default-500">
                                {item.usu_tipo}
                            </span>
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
                        <Chip size="sm" variant="flat" color={map[estado] ?? "default"}>
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