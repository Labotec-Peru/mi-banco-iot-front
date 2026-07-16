import { useState, useMemo } from "react";
import TableComponent, {
    type CustomColumnDef,
    type FilterFieldDef,
} from "../../../components/ux/TableComponent";
import { useGetBitacoraJasperReportQuery } from "../services/mapApi";
import type { JasperReportItem } from "../services/mapApi";
import { Chip } from "@heroui/react";

const PAGE_SIZE_DEFAULT = 15;

export default function JasperBitacoraTabla() {
    const [filterValues, setFilterValues] = useState<Record<string, string>>({
        cod_nevera: "",
        page: "",
        size: "",
    });
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);
    const [sortDescriptor, setSortDescriptor] = useState<{
        column: string;
        direction: "ascending" | "descending";
    }>({ column: "dis_ult_conex", direction: "descending" });

    const { data, isLoading, isFetching } = useGetBitacoraJasperReportQuery({
        cod_nevera: filterValues.cod_nevera,
        page: page,
        size: pageSize,
    });

    const devices = data?.data ?? [];
    const totalRegistros = data?.totalRegistros ?? 0;


    const columns: CustomColumnDef<JasperReportItem>[] = useMemo(
        () => [
            {
                key: "dis_cod_nevera",
                label: "Nevera",
                width: 200,
                sticky: true,
                render: (item) => (
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col leading-tight">
                            <span className="font-semibold text-slate-700">{item.codigoNevera}</span>
                            <span className="text-[11px] text-slate-400">{item.iccid}</span>
                        </div>
                    </div>
                ),
            },
            { key: "smsId", label: "SMS ID", width: 130 },
            { key: "messageText", label: "Mensaje", width: 200 },
            { key: "senderLogin", label: "Sender Login", width: 130 },
            { key: "sentTo", label: "Enviado a", width: 130 },
            { key: "sentFrom", label: "Enviado desde", width: 130 },
            { key: "msgType", label: "Tipo de mensaje", width: 130 },
            { key: "dateSent", label: "Fecha de envío", width: 130 },
            { key: "dateReceived", label: "Fecha de recepción", width: 130 },
            {
                key: "status",
                label: "Estado",
                width: 130,
                align: "center",
                render: (item) => {
                    const estado = item.status?.toLowerCase();
                    const map: Record<string, "success" | "danger" | "warning" | "default"> = {
                        entregado: "success",
                        fallido: "danger",
                        desconocido: "default",
                    };
                    return (
                        <Chip size="sm" variant="solid" color={map[estado] ?? "default"}>
                            {item.status}
                        </Chip>
                    );
                },
            },
            { key: "dateModified", label: "Fecha de modificación", width: 130 },
            { key: "dateDispositivo", label: "Fecha del dispositivo", width: 130 },

        ],
        []
    );



    const filters: FilterFieldDef[] = [
        { key: "cod_nevera", type: "text", placeholder: "Cod Nevera" },
    ];

    return (
        <TableComponent
            data={devices}
            columns={columns}
            idField="dis_cod_nevera"
            filters={filters}
            filterValues={filterValues}
            onFilterChange={(key, value) => {
                setFilterValues((prev) => ({ ...prev, [key]: value }));
                setPage(1);
            }}
            onClearFilters={() => {
                setFilterValues({
                    cod_nevera: "",
                });
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