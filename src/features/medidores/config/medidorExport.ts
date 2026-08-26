import * as XLSX from "xlsx";
import type { Medidor } from "../types/medidor";
import { API_ESTADO_CONFIG } from "./medidorStatus";

export const mapMedidorToExportRow = (medidor: Medidor) => ({
    "N° Serie": medidor.numeroSerie,
    "Código POD": medidor.codigoPod,
    IMEI: medidor.imei,
    Marca: medidor.marca,
    Modelo: medidor.modelo,
    Tipo: medidor.tipoMedidor,
    Tecnología: medidor.tecnologiaRed,
    "Empresa Cliente": medidor.empresaCliente,
    "Empresa Proveedora": medidor.empresaProveedora,
    Dirección: medidor.direccion,
    Latitud: medidor.latitud,
    Longitud: medidor.longitud,
    "Valor Inicial (L)": medidor.valorInicial,
    "Fecha de Instalación": medidor.fechaInstalacion,
    Estado: API_ESTADO_CONFIG[medidor.estado]?.label || medidor.estado,
});

export const exportMedidoresToExcel = (medidores: Medidor[], filename?: string) => {
    const rows = medidores.map(mapMedidorToExportRow);
    
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Medidores");
    
    const fileName = filename || `medidores_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
};