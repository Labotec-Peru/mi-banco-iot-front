import type { SerieEquipo } from "../types/serie";

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();
const daysAhead = (d: number) => new Date(now + d * 86_400_000).toISOString();

export const MOCK_SERIES: SerieEquipo[] = [
  {
    id: "1",
    serie: "SN-METERSIT-77291",
    marca: "METERSIT S.R.L.",
    modelo: "MTSB-033",
    firmware: "v3.1.2",
    ultimaConexion: minutesAgo(2),
    estado: "instalado",
    medidorInstalado: "DA21008212",
    proveedor: "Flusytec SAC",
    garantiaHasta: daysAhead(340),
  },
  {
    id: "2",
    serie: "SN-METERSIT-77292",
    marca: "METERSIT S.R.L.",
    modelo: "MTSB-033",
    firmware: "v3.1.2",
    ultimaConexion: minutesAgo(15),
    estado: "instalado",
    medidorInstalado: "DH-1024",
    proveedor: "Flusytec SAC",
    garantiaHasta: daysAhead(340),
  },
  {
    id: "3",
    serie: "SN-DH-40012",
    marca: "Donghai DH",
    modelo: "DH-2101",
    firmware: "v2.0.4",
    ultimaConexion: daysAgo(6),
    estado: "con_falla",
    medidorInstalado: null,
    proveedor: "AquaTech Perú",
    garantiaHasta: daysAgo(10), // vencida
  },
  {
    id: "4",
    serie: "SN-METERSIT-77310",
    marca: "METERSIT S.R.L.",
    modelo: "MTSB-033",
    firmware: "v3.1.2",
    ultimaConexion: null,
    estado: "en_stock",
    medidorInstalado: null,
    proveedor: "Flusytec SAC",
    garantiaHasta: daysAhead(365),
  },
  {
    id: "5",
    serie: "SN-DH-40018",
    marca: "Donghai DH",
    modelo: "DH-2101",
    firmware: "v2.0.4",
    ultimaConexion: null,
    estado: "en_stock",
    medidorInstalado: null,
    proveedor: "AquaTech Perú",
    garantiaHasta: daysAhead(365),
  },
  {
    id: "6",
    serie: "SN-METERSIT-77180",
    marca: "METERSIT S.R.L.",
    modelo: "MTSB-033",
    firmware: "v3.0.9",
    ultimaConexion: daysAgo(40),
    estado: "retirado",
    medidorInstalado: null,
    proveedor: "Flusytec SAC",
    garantiaHasta: daysAgo(120),
  },
];