import type { ReactNode } from "react";
import Sparkline from "./Sparkline";

type Trend = "up" | "down" | "neutral";

type StatCardProps = {
  icon?: ReactNode;
  title: string;
  value?: string;
  delta?: string;
  trend?: Trend;
  caption?: string;
  accent?: "primary" | "success" | "warning" | "danger" | "default";
  variant?: "plain" | "progress" | "sparkline";
  progress?: number; 
  progressLabel?: string;
  sparklineData?: number[];
};

const ACCENT_STYLES: Record<NonNullable<StatCardProps["accent"]>, { bg: string; text: string; bar: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", bar: "bg-primary" },
  success: { bg: "bg-success/10", text: "text-success", bar: "bg-success" },
  warning: { bg: "bg-warning/10", text: "text-warning", bar: "bg-warning" },
  danger: { bg: "bg-danger/10", text: "text-danger", bar: "bg-danger" },
  default: { bg: "bg-default-100", text: "text-foreground", bar: "bg-default-400" },
};

const TREND_STYLES: Record<Trend, string> = {
  up: "text-primary",
  down: "text-danger",
  neutral: "text-default-400",
};

export default function StatCard({
  icon,
  title,
  value,
  delta,
  trend = "neutral",
  caption,
  accent = "default",
  variant = "plain",
  progress,
  progressLabel,
  sparklineData,
}: StatCardProps) {
  const accentStyle = ACCENT_STYLES[accent];

  return (
    <div className="rounded-3xl bg-content1  shadow-sm p-5 flex flex-col justify-between gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-default-500">{title}</p>
        <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${accentStyle.bg} ${accentStyle.text}`}>
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">{value ?? "--"}</span>
          {delta && <span className={`text-xs font-semibold ${TREND_STYLES[trend]}`}>{delta}</span>}
        </div>

        {variant === "sparkline" && sparklineData && (
          <div className="w-20 h-9 shrink-0">
            <Sparkline data={sparklineData} color={`var(--${accent === "default" ? "foreground" : accent})`} />
          </div>
        )}
      </div>

      {variant === "progress" && typeof progress === "number" && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-default-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${accentStyle.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          {progressLabel && <span className="text-xs text-default-400 shrink-0">{progressLabel}</span>}
        </div>
      )}

      {caption && <p className={`text-xs dark:text-secondary ${TREND_STYLES[trend]}`}>{caption}</p>}
    </div>
  );
}