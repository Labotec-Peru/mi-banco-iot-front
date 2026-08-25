import { Chip } from "@heroui/react";
import { CheckCircle, DangerTriangle } from "@solar-icons/react";
import RadialChartWithLegend from "../../../components/ux/RadialChartWithLegend";
import type { RadialChartData } from "../../../components/ux/RadialChart";

type ValveStatusPanelProps = {
  data?: RadialChartData[];
};

export default function GraphicsPanel({
  data = [
    { name: "Online", value: 124, fill: "#22c55e" },
    { name: "Advertencia", value: 26, fill: "#eab308" },
    { name: "Con alerta", value: 10, fill: "#ef4444" },
    { name: "Sin conexión", value: 0, fill: "#6b7280" },
  ],
}: ValveStatusPanelProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const filteredData = data.filter((item) => item.value > 0);

  const onlinePercent = ((data.find(d => d.name === "Online")?.value || 0) / total * 100).toFixed(1);
  const alertCount = data.find(d => d.name === "Con alerta")?.value || 0;
  const warningCount = data.find(d => d.name === "Advertencia")?.value || 0;

  const getStatusColor = (name: string) => {
    switch (name) {
      case "Online": return "text-success";
      case "Advertencia": return "text-warning";
      case "Con alerta": return "text-danger";
      case "Offline": return "text-default-400";
      default: return "text-default-500";
    }
  };

  const getStatusText = (name: string) => {
    switch (name) {
      case "Online": return "En línea";
      case "Advertencia": return "Advertencia";
      case "Con alerta": return "Con alerta";
      case "Offline": return "Sin conexión";
      default: return name;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const originalValue = data.originalValue || 0;
      return (
        <div className="bg-background dark:bg-zinc-900 border border-default-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm text-foreground">
            {getStatusText(data.name)}
          </p>
          <p className="text-xs text-default-500 dark:text-zinc-400">
            {originalValue} dispositivos ({data.value.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <Chip
            size="sm"
            variant="flat"
            color={filteredData[0]?.name === "Online" ? "success" : "warning"}
            className="font-semibold"
          >
            {filteredData[0]?.name === "Online" ? (
              <span className="flex items-center gap-1">
                <CheckCircle /> Sistema operativo
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <DangerTriangle /> Dispositivos con problemas
              </span>
            )}
          </Chip>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-default-400 dark:text-zinc-500">
            Total: {total} dispositivos
          </span>
        </div>
      </div>

      <div className="relative my-3 before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-zinc-300 dark:before:via-zinc-700 before:to-transparent" />

      <div className="flex flex-1 gap-6">
        <div className="flex-1">
          <RadialChartWithLegend
            data={data}
            total={total}
            legendView={false}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            customTooltip={CustomTooltip}
            chartHeight={200}
            chartWidth={200}
            legendPosition="right"
          />
        </div>

        <div className="flex flex-col justify-center gap-3 min-w-[120px]">
          <div className="bg-success/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-success font-medium uppercase tracking-wider">
              En línea
            </p>
            <p className="text-2xl font-bold text-success">
              {onlinePercent}%
            </p>
            <p className="text-[10px] text-default-400">
              {data.find(d => d.name === "Online")?.value || 0} dispositivos
            </p>
          </div>

          {(alertCount > 0 || warningCount > 0) && (
            <div className="flex gap-2">
              {alertCount > 0 && (
                <div className="flex-1 bg-danger/10 rounded-xl p-2 text-center">
                  <p className="text-[8px] text-danger font-medium uppercase tracking-wider">
                    Alertas
                  </p>
                  <p className="text-lg font-bold text-danger">
                    {alertCount}
                  </p>
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex-1 bg-warning/10 rounded-xl p-2 text-center">
                  <p className="text-[8px] text-warning font-medium uppercase tracking-wider">
                    Advertencias
                  </p>
                  <p className="text-lg font-bold text-warning">
                    {warningCount}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative my-3 before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-zinc-300 dark:before:via-zinc-700 before:to-transparent" />

      <div className="flex justify-between text-[10px] text-default-400 dark:text-zinc-500">
        <span>Última actualización: Hace 2 min</span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Conectado
        </span>
      </div>
    </div>
  );
}