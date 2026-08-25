import type { ReactNode } from "react";
import { AltArrowUp, AltArrowDown } from "@solar-icons/react";
import Sparkline from "./Sparkline";
import RadialChart, { type RadialChartData, type ChartType } from "../../../components/ux/RadialChart";

type Trend = "up" | "down" | "neutral";
type Accent = "primary" | "success" | "warning" | "danger" | "default";
type Variant = "plain" | "progress" | "sparkline" | "chart";

type StatCardProps = {
  icon?: ReactNode;
  title: string;
  value?: string;
  delta?: string;
  trend?: Trend;
  caption?: string;
  captionIcon?: ReactNode;
  accent?: Accent;
  variant?: Variant;
  progress?: number;
  progressLabel?: string;
  sparklineData?: number[];
  chartType?: ChartType;
  chartData?: RadialChartData[];
  chartTotal?: number;
  chartInnerRadius?: string;
  chartOuterRadius?: string;
  chartBarSize?: number;
  chartPaddingAngle?: number;
  chartCornerRadius?: number;
  extraInfo?: { label: string; value: string; color?: string }[];
};

const ACCENT_STYLES: Record<Accent, { text: string; bar: string; glow: string; ring: string }> = {
  primary: { text: "text-primary", bar: "bg-primary", glow: "bg-primary", ring: "ring-primary/15" },
  success: { text: "text-success", bar: "bg-success", glow: "bg-success", ring: "ring-success/15" },
  warning: { text: "text-warning", bar: "bg-warning", glow: "bg-warning", ring: "ring-warning/15" },
  danger: { text: "text-danger", bar: "bg-danger", glow: "bg-danger", ring: "ring-danger/15" },
  default: { text: "text-foreground", bar: "bg-default-400", glow: "bg-default-400", ring: "ring-default-200/40" },
};

const TREND_PILL: Record<Trend, string> = {
  up: "bg-success/10 text-success",
  down: "bg-danger/10 text-danger",
  neutral: "bg-default-100 text-default-500",
};

function TrendBadge({ trend, delta }: { trend: Trend; delta: string }) {
  const Icon = trend === "up" ? AltArrowUp : trend === "down" ? AltArrowDown : null;
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${TREND_PILL[trend]}`}>
      {Icon && <Icon size={10} weight="Bold" />}
      {delta}
    </span>
  );
}

export default function StatCard({
  icon,
  title,
  value,
  delta,
  trend = "neutral",
  caption,
  captionIcon,
  accent = "default",
  variant = "plain",
  progress,
  progressLabel,
  sparklineData,
  chartType = "radial",
  chartData,
  chartTotal,
  chartInnerRadius = "55%",
  chartOuterRadius = "85%",
  chartBarSize = 12,
  chartPaddingAngle = 2,
  chartCornerRadius = 6,
  extraInfo,
}: StatCardProps) {
  const a = ACCENT_STYLES[accent];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const totalValue = chartTotal || chartData?.reduce((sum, item) => sum + item.value, 0) || 0;
      const originalValue = (data.value / 100) * totalValue;
      return (
        <div className="bg-background dark:bg-zinc-900 border border-default-200 dark:border-zinc-700 rounded-lg p-2 shadow-lg">
          <p className="font-semibold text-xs text-foreground">{data.name}</p>
          <p className="text-[10px] text-default-500 dark:text-zinc-400">
            {Math.round(originalValue)} ({data.value.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (!chartData || variant !== "chart") return null;

    return (
      <div className="flex items-center gap-4">
        <div className="h-[72px] w-[72px] shrink-0">
          <RadialChart
            data={chartData}
            total={chartTotal}
            type={chartType}
            innerRadius={chartInnerRadius}
            outerRadius={chartOuterRadius}
            barSize={chartBarSize}
            paddingAngle={chartPaddingAngle}
            cornerRadius={chartCornerRadius}
            customTooltip={CustomTooltip}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          {chartData.slice(0, 4).map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.fill }}
              />
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[10px] text-default-500 truncate max-w-[60px]">
                  {item.name}
                </span>
                <span className="text-[11px] font-semibold text-default-700 tabular-nums">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
          {chartData.length > 4 && (
            <span className="text-[9px] text-default-400 text-center">
              +{chartData.length - 4} más
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-content1 p-5 shadow-xs ring-1 ring-default-100 transition-shadow hover:shadow-md">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full ${a.glow} opacity-[0.07] blur-2xl transition-opacity group-hover:opacity-[0.12]`}
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-default-400">
            {title}
          </p>
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ring-1 ${a.ring} ${a.text} bg-content2/60`}>
            {icon}
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold leading-none tracking-tight text-foreground tabular-nums">
              {value ?? "--"}
            </span>
            {delta && <TrendBadge trend={trend} delta={delta} />}
          </div>

          {variant === "sparkline" && sparklineData && (
            <div className="h-8 w-16 shrink-0">
              <Sparkline data={sparklineData} color={`var(--${accent === "default" ? "foreground" : accent})`} />
            </div>
          )}
        </div>

        {variant === "progress" && typeof progress === "number" && (
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-default-100">
              <div
                className={`h-full rounded-full ${a.bar} transition-all duration-500`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            {progressLabel && (
              <span className="shrink-0 text-[10px] font-medium text-default-400 tabular-nums">
                {progressLabel}
              </span>
            )}
          </div>
        )}

        {renderChart()}

        {extraInfo && extraInfo.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-dashed border-divider/40">
            {extraInfo.map((info, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-[9px] text-default-400 uppercase tracking-wider">
                  {info.label}
                </span>
                <span className={`text-xs font-semibold ${info.color || 'text-default-700'}`}>
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {caption && (
          <div className="flex items-center gap-1.5 text-xs text-default-500">
            {captionIcon}
            <span className="truncate">{caption}</span>
          </div>
        )}
      </div>
    </div>
  );
}