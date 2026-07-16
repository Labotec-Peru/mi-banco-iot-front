// Neveras.tsx
import { useState, useCallback } from "react";
import PageContainer from "../../../layouts/PageContainer";
import NeverasTabla from "../components/NeverasTabla";
import GraphicsCountNeveras from "../components/GraphicsCountNeveras";

export default function Neveras() {
  const [activeFilter, setActiveFilter] = useState<string>("");

  const handleFilterByEstado = useCallback((estadoLabel: string) => {
    setActiveFilter(estadoLabel);
  }, []);

  const handleClearFilter = useCallback(() => {
    setActiveFilter("");
  }, []);

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-2">
        {activeFilter && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-sm text-blue-800">
                Filtrando por estado:
              </span>
              <span className="font-semibold text-blue-900 bg-blue-100 px-2 py-1 rounded text-sm">
                {activeFilter}
              </span>
            </div>
            <button
              onClick={handleClearFilter}
              className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtro
            </button>
          </div>
        )}

        <GraphicsCountNeveras 
          layout="grid" 
          onFilterByEstado={handleFilterByEstado}
        />
      </div>

      <NeverasTabla 
        externalFilter={activeFilter}
        onClearExternalFilter={handleClearFilter}
      />
    </PageContainer>
  );
}