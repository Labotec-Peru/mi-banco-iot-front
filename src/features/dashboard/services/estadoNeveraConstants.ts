
export interface EstadoNevera {
  value: number;
  label: string;
  filterKey: string;
}

export const ESTADOS_NEVERA: EstadoNevera[] = [
  { value: 2, label: "Operativo - Cartera", filterKey: "Operativo - Cartera" },
  { value: 3, label: "Operativo - Censo", filterKey: "Operativo - Censo" },
  { value: 4, label: "Operativo - Instalación", filterKey: "Operativo - Instalación" },
  { value: 5, label: "Taller", filterKey: "Taller" },
  { value: 6, label: "Distribuidor", filterKey: "Distribuidor" },
  { value: 7, label: "Desconexión por Energía", filterKey: "Desconexión por Energía" },
  { value: 1, label: "Fuera de Zona", filterKey: "Fuera de Zona" },
  { value: 8, label: "Fuera de Línea", filterKey: "Fuera de Línea" },
];

export const getEstadoByLabel = (label: string): EstadoNevera | undefined => {
  return ESTADOS_NEVERA.find(e => e.label === label);
};

export const getEstadoByValue = (value: number): EstadoNevera | undefined => {
  return ESTADOS_NEVERA.find(e => e.value === value);
};

export const getEstadoByFilterKey = (filterKey: string): EstadoNevera | undefined => {
  return ESTADOS_NEVERA.find(e => e.filterKey === filterKey);
};

export const ESTADO_OPTIONS_TABLE = [
  { value: "", label: "Todos" },
  ...ESTADOS_NEVERA.map(e => ({ value: e.filterKey, label: e.label }))
];

export const ESTADO_OPTIONS_MAP = [
  { value: 0, label: "Todos" },
  ...ESTADOS_NEVERA.map(e => ({ value: e.value, label: e.label }))
];