import { useState, useEffect } from "react";
import Map from "./Map";
import Filters from "./Filters";
import { useGetNeverasMapaQuery, useGetTalleresNestleQuery } from "../services/mapApi";

import MAP_STYLES from "../styles/MAP_STYLES";
import { ESTADOS_NEVERA } from "../services/estadoNeveraConstants";
import { useNeveraFilterContext } from "../contexts/NeveraFilterContext";
import { useSyncMapTheme } from "../../../hooks/useSyncMapTheme";
import { ThinkingOrb } from "thinking-orbs";

export default function NeverasMapa() {
  const {
    setDistribuidorFilter,
    setEstadoFilter,
    distribuidorFilter,
    clearAllFilters
  } = useNeveraFilterContext();

  const [filters, setFilters] = useState({
    empresa: "9",
    tipo: "congeladora",
    cod_nevera: "",
    distribuidor: [] as string[],
    estado: 0,
    departamento: "",
  });
  const [apiFilters, setApiFilters] = useState(filters);
  const { mapStyle, setMapStyle } = useSyncMapTheme();

  useEffect(() => {
    if (apiFilters.distribuidor.length > 0) {
      setDistribuidorFilter(apiFilters.distribuidor.join(','));
    }

    if (apiFilters.estado !== 0) {
      const estadoNevera = ESTADOS_NEVERA.find(e => e.value === apiFilters.estado);
      if (estadoNevera) {
        setEstadoFilter(estadoNevera.filterKey);
      }
    }
  }, [apiFilters, setDistribuidorFilter, setEstadoFilter]);

  useEffect(() => {
    if (distribuidorFilter && distribuidorFilter !== apiFilters.distribuidor.join(',')) {
      const distribuidores = distribuidorFilter.split(',').filter(Boolean);
      if (distribuidores.length > 0) {
        const newFilters = {
          ...filters,
          distribuidor: distribuidores,
        };
        setFilters(newFilters);
        setApiFilters(newFilters);
      }
    }
  }, [distribuidorFilter]);

  const { data: talleresData } = useGetTalleresNestleQuery({
    departamento: apiFilters.departamento,
  });
  const talleres = talleresData?.data ?? [];

  const {
    data,
    isLoading,
    isFetching,
    error,
  } = useGetNeverasMapaQuery(apiFilters);

  const aplicarFiltros = () => {
    setApiFilters(filters);
  };

  const handleFilterFromChart = (estadoLabel: string) => {
    const estadoNevera = ESTADOS_NEVERA.find(e =>
      e.label.toLowerCase().includes(estadoLabel.toLowerCase()) ||
      e.filterKey.toLowerCase().includes(estadoLabel.toLowerCase())
    );

    if (estadoNevera) {
      const newFilters = {
        ...filters,
        estado: estadoNevera.value,
      };
      setFilters(newFilters);
      setApiFilters(newFilters);
    }
  };

  const handleClearAllFiltersFromDashboard = () => {
    clearAllFilters();
    const resetFilters = {
      empresa: "9",
      tipo: "congeladora",
      cod_nevera: "",
      distribuidor: [] as string[],
      estado: 0,
      departamento: "",
    };
    setFilters(resetFilters);
    setApiFilters(resetFilters);
  };

  const neveras = data?.data ?? [];

  return (
    <div className="relative w-full h-full">
      <Filters
        filters={filters}
        setFilters={setFilters}
        onApply={aplicarFiltros}
        isLoading={isFetching}
        neveras={neveras}
        mapStyle={mapStyle}
        showMapStyles={true}
        showFilters={false}
        setMapStyle={setMapStyle}
        mapStyles={MAP_STYLES}
      />

      <Map
        neveras={neveras}
        mapStyle={mapStyle}
        talleres={talleres}
        onFilterFromChart={handleFilterFromChart}
        onClearFilters={handleClearAllFiltersFromDashboard}
      />

      {(isLoading) && (
        <div className="absolute inset-0 z-1 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="px-8 py-6 flex flex-col items-center gap-4">
            <ThinkingOrb state="composing" size={64} />
            <span className="text-sm font-medium text-white">
              Cargando ...
            </span>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 right-4 z-10">
        {error && <div>Error al cargar.</div>}
      </div>
    </div>
  );
}