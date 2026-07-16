import { useState, useCallback } from "react";
import { 
  ESTADOS_NEVERA, 
  getEstadoByValue, 
  getEstadoByFilterKey 
} from "../services/estadoNeveraConstants";

export interface TablaFilters {
  cod_nevera: string;
  imei: string;
  locacion: string;
  distribuidor: string;
  estado: string; 
}

export interface MapaFilters {
  empresa: string;
  tipo: string;
  cod_nevera: string;
  distribuidor: string[];
  estado: number;
  departamento: string;
}

interface UseNeveraFiltersReturn {
  tablaFilters: TablaFilters;
  mapaFilters: MapaFilters;
  setTablaFilter: (key: keyof TablaFilters, value: string) => void;
  setMapaFilter: (key: keyof MapaFilters, value: any) => void;
  resetTablaFilters: () => void;
  resetMapaFilters: () => void;
  convertTablaToMapa: (tablaFilters: TablaFilters) => MapaFilters;
  convertMapaToTabla: (mapaFilters: MapaFilters) => TablaFilters;
  setFilterFromLabel: (label: string) => void;
}

const defaultTablaFilters: TablaFilters = {
  cod_nevera: "",
  imei: "",
  locacion: "",
  distribuidor: "",
  estado: "",
};

const defaultMapaFilters: MapaFilters = {
  empresa: "9",
  tipo: "congeladora",
  cod_nevera: "",
  distribuidor: [],
  estado: 0,
  departamento: "",
};

export function useNeveraFilters(): UseNeveraFiltersReturn {
  const [tablaFilters, setTablaFiltersState] = useState<TablaFilters>(defaultTablaFilters);
  const [mapaFilters, setMapaFiltersState] = useState<MapaFilters>(defaultMapaFilters);

  const setTablaFilter = useCallback((key: keyof TablaFilters, value: string) => {
    setTablaFiltersState(prev => ({ ...prev, [key]: value }));
  }, []);

  const setMapaFilter = useCallback((key: keyof MapaFilters, value: any) => {
    setMapaFiltersState(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetTablaFilters = useCallback(() => {
    setTablaFiltersState(defaultTablaFilters);
  }, []);

  const resetMapaFilters = useCallback(() => {
    setMapaFiltersState(defaultMapaFilters);
  }, []);

  const convertTablaToMapa = useCallback((filters: TablaFilters): MapaFilters => {
    const estadoNevera = getEstadoByFilterKey(filters.estado);
    return {
      empresa: "9",
      tipo: "congeladora",
      cod_nevera: filters.cod_nevera,
      distribuidor: filters.distribuidor ? [filters.distribuidor] : [],
      estado: estadoNevera?.value ?? 0,
      departamento: "",
    };
  }, []);

  const convertMapaToTabla = useCallback((filters: MapaFilters): TablaFilters => {
    const estadoNevera = getEstadoByValue(filters.estado);
    return {
      cod_nevera: filters.cod_nevera,
      imei: "",
      locacion: "",
      distribuidor: filters.distribuidor?.[0] ?? "",
      estado: estadoNevera?.filterKey ?? "",
    };
  }, []);

  const setFilterFromLabel = useCallback((label: string) => {
    const estado = ESTADOS_NEVERA.find(e => 
      e.label.toLowerCase().includes(label.toLowerCase())
    );
    
    if (estado) {
      setTablaFiltersState(prev => ({ ...prev, estado: estado.filterKey }));
      setMapaFiltersState(prev => ({ ...prev, estado: estado.value }));
    }
  }, []);

  return {
    tablaFilters,
    mapaFilters,
    setTablaFilter,
    setMapaFilter,
    resetTablaFilters,
    resetMapaFilters,
    convertTablaToMapa,
    convertMapaToTabla,
    setFilterFromLabel,
  };
}