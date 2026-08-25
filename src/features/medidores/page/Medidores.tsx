import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Button, Chip, Tooltip, Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { AddCircle, PenNewSquare, TrashBinTrash, FileDownload, Widget, ListArrowDown } from "@solar-icons/react";
import PageContainer from "../../../layouts/PageContainer";
import TableComponent, { type CustomColumnDef } from "../../../components/ux/TableComponent";
import { MOCK_MEDIDORES } from "../services/medidoresMock";
import { ESTADO_CONFIG, type Medidor } from "../types/medidor";
import MedidorCard from "../components/MedidorCard";
import StatsRow from "../../dashboard/components/StatsRow";

type ViewMode = "table" | "cards";

export default function Medidores() {
  const [data] = useState<Medidor[]>(MOCK_MEDIDORES);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [sortDescriptor, setSortDescriptor] = useState<{ column: string; direction: "ascending" | "descending" }>({
    column: "numeroSerie",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilterValues({});
    setPage(1);
  };

  const filteredSorted = useMemo(() => {
    let rows = [...data];

    if (filterValues.search) {
      const q = filterValues.search.toLowerCase();
      rows = rows.filter(
        (m) =>
          m.numeroSerie.toLowerCase().includes(q) ||
          m.codigoPod.toLowerCase().includes(q) ||
          m.empresaCliente.toLowerCase().includes(q)
      );
    }
    if (filterValues.tipoMedidor) {
      rows = rows.filter((m) => m.tipoMedidor === filterValues.tipoMedidor);
    }
    if (filterValues.estado) {
      rows = rows.filter((m) => m.estado === filterValues.estado);
    }

    rows.sort((a, b) => {
      const av = String(a[sortDescriptor.column as keyof Medidor] ?? "");
      const bv = String(b[sortDescriptor.column as keyof Medidor] ?? "");
      const cmp = av.localeCompare(bv);
      return sortDescriptor.direction === "ascending" ? cmp : -cmp;
    });

    return rows;
  }, [data, filterValues, sortDescriptor]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [filteredSorted, page, pageSize]);

  const handleExportExcel = () => {
    const rows = filteredSorted.map((m) => ({
      "N° Serie": m.numeroSerie,
      "Código POD": m.codigoPod,
      IMEI: m.imei,
      Marca: m.marca,
      Modelo: m.modelo,
      Tipo: m.tipoMedidor,
      Tecnología: m.tecnologiaRed,
      "Empresa Cliente": m.empresaCliente,
      "Empresa Proveedora": m.empresaProveedora,
      Dirección: m.direccion,
      Latitud: m.latitud,
      Longitud: m.longitud,
      "Valor Inicial (L)": m.valorInicial,
      "Fecha de Instalación": m.fechaInstalacion,
      Estado: ESTADO_CONFIG[m.estado].label,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Medidores");
    XLSX.writeFile(wb, `medidores_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleCreate = () => {
    console.log("Abrir formulario de creación");
  };

  const handleEdit = (medidor: Medidor) => {
    console.log("Editar", medidor.id);
  };

  const handleDelete = (medidor: Medidor) => {
    console.log("Eliminar", medidor.id);
  };

  const columns: CustomColumnDef<Medidor>[] = [
    {
      key: "numeroSerie",
      label: "N° Serie",
      width: 130,
      sticky: true,
      render: (m) => <span className="font-semibold">{m.numeroSerie}</span>,
    },
    { key: "codigoPod", label: "Código POD", width: 120 },
    { key: "imei", label: "IMEI", width: 150 },
    { key: "marca", label: "Marca", width: 150 },
    { key: "modelo", label: "Modelo", width: 110 },
    { key: "tipoMedidor", label: "Tipo", width: 90 },
    { key: "tecnologiaRed", label: "Tecnología", width: 100 },
    { key: "empresaCliente", label: "Empresa Cliente", width: 180 },
    { key: "empresaProveedora", label: "Empresa Proveedora", width: 160 },
    { key: "direccion", label: "Dirección", width: 240 },
    {
      key: "fechaInstalacion",
      label: "Fecha Instalación",
      width: 130,
      render: (m) => new Date(m.fechaInstalacion).toLocaleDateString("es-PE"),
    },
    {
      key: "estado",
      label: "Estado",
      width: 170,
      align: "center",
      render: (m) => (
        <Chip size="sm" variant="flat" color={ESTADO_CONFIG[m.estado].color} classNames={{ content: "text-[11px] font-medium" }}>
          {ESTADO_CONFIG[m.estado].label}
        </Chip>
      ),
    },
    {
      key: "acciones",
      label: "Acciones",
      width: 90,
      sortable: false,
      align: "center",
      render: (m) => (
        <div className="flex items-center justify-center gap-1">
          <Tooltip content="Editar" size="sm">
            <Button isIconOnly size="sm" variant="light" onPress={() => handleEdit(m)}>
              <PenNewSquare size={16} className="text-default-500" />
            </Button>
          </Tooltip>
          <Tooltip content="Eliminar" size="sm" color="danger">
            <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(m)}>
              <TrashBinTrash size={16} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <StatsRow />
      <div className="flex flex-col gap-4">
        

        <TableComponent<Medidor>
          data={paginated}
          columns={columns}
          idField="id"
          filters={[
            { key: "search", type: "text", placeholder: "Buscar por serie, POD o cliente" },
            {
              key: "tipoMedidor",
              type: "select",
              placeholder: "Tipo",
              options: [{ value: "Agua", label: "Agua" }],
            },
            {
              key: "estado",
              type: "select",
              placeholder: "Estado",
              options: [
                { value: "activo", label: "Activo" },
                { value: "pendiente", label: "Pendiente de instalación" },
                { value: "inactivo", label: "Inactivo" },
              ],
            },
          ]}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          headerActions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="flat" startContent={<FileDownload size={16} />}  onPress={handleExportExcel}>
                Exportar Excel
              </Button>
              <Button size="sm" color="primary" startContent={<AddCircle size={16} />} onPress={handleCreate}>
                Nuevo medidor
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
          totalRegistros={filteredSorted.length}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          viewMode={viewMode}
          cardView={(medidor) => (
            <MedidorCard
              key={medidor.id}
              medidor={medidor}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      </div>
    </PageContainer>
  );
}