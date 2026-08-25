import StatCard from "./StatCard";
import {
  WiFiRouterMinimalistic,
  Danger,
  RoundAltArrowRight,
  Water,
} from "@solar-icons/react";

export default function StatsRow() {
  const deviceStatusData = [
    { name: "Online", value: 124, fill: "#22c55e" },
    { name: "Advertencia", value: 26, fill: "#eab308" },
    { name: "Con alerta", value: 10, fill: "#ef4444" },
    { name: "Offline", value: 0, fill: "#6b7280" },
  ];

  const alertStatusData = [
    { name: "Críticas", value: 2, fill: "#ef4444" },
    { name: "Advertencia", value: 4, fill: "#eab308" },
    { name: "Informativas", value: 8, fill: "#3b82f6" },
  ];  

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Flujo Máximo"
        icon={<Water size={18} weight="BoldDuotone" />}
        accent="primary"
        value="78.5%"
        variant="progress"
        progress={78.5}
        progressLabel="40,925L"
        caption="Mibanco - Huaycán"
        extraInfo={[
          { label: "Promedio", value: "62.3 L/min", color: "text-primary" },
          { label: "Pico", value: "89.2 L/min", color: "text-success" },
        ]}
      />

      <StatCard
        title="Volumen Máximo"
        icon={<Water size={18} weight="BoldDuotone" />}
        accent="primary"
        value="78.5%"
        variant="progress"
        progress={78.5}
        progressLabel="40,925L"
        caption="Mibanco - Canto Grande"
        extraInfo={[
          { label: "Promedio", value: "58.7 L/min", color: "text-primary" },
          { label: "Pico", value: "92.1 L/min", color: "text-success" },
        ]}
      />

      <StatCard
        title="Dispositivos Conectados"
        icon={<WiFiRouterMinimalistic size={18} weight="BoldDuotone" />}
        accent="primary"
        value="124/200"
        delta="80%"
        trend="up"
        variant="chart"
        chartType="radial"
        chartData={deviceStatusData}
        chartTotal={160}
        caption="Operacional"
        captionIcon={<RoundAltArrowRight size={12} className="text-default-300" />}
        
      />

      <StatCard
        title="Alertas Activas"
        icon={<Danger size={18} weight="BoldDuotone" />}
        accent="warning"
        value="64"
        delta="8.2%"
        trend="down"
        variant="chart"
        chartType="pie"
        chartData={alertStatusData}
        chartTotal={14}
        chartPaddingAngle={3}
        caption="2 dispositivos críticos"       
      />
    </div>
  );
}