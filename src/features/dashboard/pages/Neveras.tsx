// Neveras.tsx
import { useState, useCallback, useRef } from "react";
import PageContainer from "../../../layouts/PageContainer";
import NeverasTabla from "../components/NeverasTabla";
import GraphicsCountNeveras from "../components/GraphicsCountNeveras";
import { useNeveraFilterContext } from "../contexts/NeveraFilterContext";
import { Card, Tab, Tabs, CardBody } from "@heroui/react";
import GraficoDistribuidor from "../components/GraficoDistribuidor";

export default function Neveras() {
  const [activeFilter, setActiveFilter] = useState<string>("");
  const { clearAllFilters } = useNeveraFilterContext();
  const [clearKey, setClearKey] = useState(0);

  const handleFilterByEstado = useCallback((estadoLabel: string) => {
    setActiveFilter(estadoLabel);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveFilter("");
    clearAllFilters(); 
    setClearKey(prev => prev + 1);
  }, [clearAllFilters]);

  const handleDistribuidorClick = useCallback((distribuidor: string) => {
    setActiveFilter(""); 
  }, []);

  const handleEstadoFromGrafico = useCallback((estado: string) => {
    setActiveFilter(estado);
  }, []);

  return (
    <PageContainer>
      <div className="flex w-full flex-col">
        <Tabs aria-label="Options">
          <Tab key="congeladoras" title="Por Congeladoras">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
              <GraphicsCountNeveras             
                layout="grid"
                onFilterByEstado={handleFilterByEstado}
                onClearFilters={handleClearAllFilters}
              />
            </div>
          </Tab>
          <Tab key="por_distribuidores" title="Por Distribuidores">
            <GraficoDistribuidor             
              onDistribuidorClick={handleDistribuidorClick}
              onEstadoClick={handleEstadoFromGrafico}
              onClearFilters={handleClearAllFilters} 
            />
          </Tab>
        </Tabs>
      </div>

      <NeverasTabla
        externalFilter={activeFilter}
        onClearExternalFilter={handleClearAllFilters}
      />
    </PageContainer>
  );
}