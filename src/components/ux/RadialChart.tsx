import { useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from "recharts";

export interface RadialChartData {
  name: string;
  value: number;
  fill: string;
}

export type ChartType = "radial" | "pie";

export interface RadialChartProps {
  data: RadialChartData[];
  total?: number;
  type?: ChartType;
  innerRadius?: string;
  outerRadius?: string;
  barSize?: number;
  cornerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  paddingAngle?: number;
  label?: boolean;
  labelLine?: boolean;
  onHover?: (index: number | null) => void;
  customTooltip?: (props: any) => React.ReactNode;
}

export default function RadialChart({
  data,
  total,
  type = "radial",
  innerRadius = "60%",
  outerRadius = "100%",
  barSize = 20,
  cornerRadius = 10,
  startAngle = 90,
  endAngle = -270,
  paddingAngle = 2,
  label = false,
  labelLine = false,
  onHover,
  customTooltip,
}: RadialChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const totalValue = total || data.reduce((sum, item) => sum + item.value, 0);
  const filteredData = data.filter((item) => item.value > 0);

  const chartData = filteredData.map((item) => ({
    ...item,
    value: (item.value / totalValue) * 100,
  }));

  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
    onHover?.(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
    onHover?.(null);
  };

  if (type === "pie") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
            label={label}
            labelLine={labelLine}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
              />
            ))}
          </Pie>
          <Tooltip content={customTooltip} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        barSize={barSize}
        data={chartData}
        startAngle={startAngle}
        endAngle={endAngle}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          angleAxisId={0}
          tick={false}
        />
        <RadialBar
          background
          dataKey="value"
          cornerRadius={cornerRadius}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.fill}
              opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
            />
          ))}
        </RadialBar>
        <Tooltip content={customTooltip} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}