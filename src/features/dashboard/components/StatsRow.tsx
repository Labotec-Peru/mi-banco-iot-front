import StatCard from "./StatCard";
import { GasStation, ChartSquare, WiFiRouterMinimalistic, Accumulator } from "@solar-icons/react";

export default function StatsRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Nivel Total Combustible"
        icon={<GasStation size={18} weight="BoldDuotone"/>}
        accent="primary"
        value="78.5%"
        variant="progress"
        progress={78.5}
        progressLabel="3,925L"
        trend="up"
        caption="↑ 2.3% en la última hora"
      />

      <StatCard
        title="Ventas del Día"
        icon={<ChartSquare size={18} weight="BoldDuotone"/>}
        accent="success"
        value="$4,285.50"
        delta="↑ 12.5%"
        trend="up"
        variant="sparkline"
        sparklineData={[8, 10, 9, 14, 16, 15, 18, 22, 20, 24]}
        caption="127 transacciones"
      />

      <StatCard
        title="Dispositivos Conectados"
        icon={<WiFiRouterMinimalistic size={18} weight="BoldDuotone" />}
        accent="primary"
        value="8/8"
        trend="up"
        caption="✓ 100% operacional"
      />

      <StatCard
        title="Bombas Activas"
        icon={<Accumulator size={18} weight="BoldDuotone" />}
        accent="warning"
        value="6/8"
        trend="down"
        caption="2 en mantenimiento"
      />
    </div>
  );
}