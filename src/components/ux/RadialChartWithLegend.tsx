import RadialChart, { type RadialChartData } from "./RadialChart";
import RadialLegend, { type RadialLegendItem } from "./RadialLegend";

export interface RadialChartWithLegendProps {
  data: RadialChartData[];
  total?: number;
  className?: string;
  chartHeight?: number;
  chartWidth?: number;
  innerRadius?: string;
  outerRadius?: string;
  barSize?: number;
  cornerRadius?: number;
  setlegendView?: boolean,
  legendView?: boolean;
  legendPosition?: "right" | "bottom";
  getStatusColor?: (name: string) => string;
  getStatusText?: (name: string) => string;
  customTooltip?: (props: any) => React.ReactNode;
  onHover?: (index: number | null) => void;
}

export default function RadialChartWithLegend({
  data,
  total,
  className = "",
  chartHeight = 200,
  chartWidth = 200,
  innerRadius = "60%",
  outerRadius = "100%",
  barSize = 20,
  cornerRadius = 10,
  legendPosition = "right",
  getStatusColor,
  getStatusText,
  customTooltip,
  legendView = true,
  onHover,
}: RadialChartWithLegendProps) {
  const totalValue =
    total ?? data.reduce((sum, item) => sum + item.value, 0);

  const legendItems: RadialLegendItem[] = data.map((item) => ({
    ...item,
    label: getStatusText
      ? getStatusText(item.name)
      : item.name,
    colorClass: getStatusColor
      ? getStatusColor(item.name)
      : undefined,
  }));


  return (
    <div
      className={`flex flex-1 items-center justify-center gap-4 ${className}`}
      style={{
        flexDirection:
          legendPosition === "bottom" ? "column" : "row",
      }}
    >
      <div
        className="shrink-0"
        style={{
          height: `${chartHeight}px`,
          width: `${chartWidth}px`,
        }}
      >
        <RadialChart
          data={data}
          total={totalValue}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          barSize={barSize}
          cornerRadius={cornerRadius}
          customTooltip={customTooltip}
          onHover={onHover}
        />
      </div>
      {legendView && (
        <RadialLegend
          items={legendItems}
          total={totalValue}
          className={
            legendPosition === "bottom"
              ? "flex-row flex-wrap justify-center"
              : ""
          }
        />
      )}
    </div>
  );
}