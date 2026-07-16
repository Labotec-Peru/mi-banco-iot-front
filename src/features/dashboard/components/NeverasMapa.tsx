// NeverasMapa.tsx
import { useState } from "react";
import Map from "./Map";
import Filters from "./Filters";
import { useGetNeverasMapaQuery, useGetTalleresNestleQuery } from "../services/mapApi";
import { Spinner } from "@heroui/react";
import MAP_STYLES from "../styles/MAP_STYLES";
import { ESTADOS_NEVERA } from "../services/estadoNeveraConstants";

export default function NeverasMapa() {
  const [filters, setFilters] = useState({
    empresa: "9",
    tipo: "congeladora",
    cod_nevera: "",
    distribuidor: [] as string[],
    estado: 0,
    departamento: "",
  });
  const [apiFilters, setApiFilters] = useState(filters);
  
  const { data: talleresData } = useGetTalleresNestleQuery({
    departamento: apiFilters.departamento,
  });
  const talleres = talleresData?.data ?? [];

  const [mapStyle, setMapStyle] = useState(
    () => localStorage.getItem("map-style") ?? MAP_STYLES[0].value
  );

  const handleSetMapStyle = (value: string) => {
    setMapStyle(value);
    localStorage.setItem("map-style", value);
  };

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

  const neveras = data?.data ?? [];

  if (error) return <div>Error al cargar las neveras.</div>;
  
  return (
    <div className="relative w-full h-screen">
      <Filters
        filters={filters}
        setFilters={setFilters}
        onApply={aplicarFiltros}
        isLoading={isFetching}
        neveras={neveras}
        showMapStyles
        mapStyle={mapStyle}
        setMapStyle={handleSetMapStyle}
        mapStyles={MAP_STYLES}
      />

      <Map 
        neveras={neveras} 
        mapStyle={mapStyle} 
        talleres={talleres}
        onFilterFromChart={handleFilterFromChart} 
      />

      {(isLoading) && (
        <div className="absolute inset-0 z-1 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="px-8 py-6 flex flex-col items-center gap-4">
            <Spinner size="lg" color="primary" />
            <span className="text-sm font-medium text-white">
              Cargando neveras...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}