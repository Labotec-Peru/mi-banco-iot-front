import type { ReactNode } from "react";

export interface RadialLegendItem {
  name: string;
  value: number;
  fill: string;
  label?: string;
  colorClass?: string;
}

export interface RadialLegendProps {
  items: RadialLegendItem[];
  total: number;
  renderItem?: (item: RadialLegendItem, index: number) => ReactNode;
  className?: string;
}

export default function RadialLegend({
  items,
  total,
  renderItem,
  className = "",
}: RadialLegendProps) {
  const defaultRender = (item: RadialLegendItem) => (
    <>
      <div
        className="h-3 w-3 rounded-full transition-transform group-hover:scale-110"
        style={{ backgroundColor: item.fill }}
      />
      <span className="text-xs text-default-600 dark:text-zinc-300 group-hover:text-default-900 dark:group-hover:text-white transition-colors">
        {item.label || item.name}
      </span>
      <span
        className={`ml-auto text-xs font-semibold ${item.colorClass || "text-default-500"}`}
      >
        {item.value}
      </span>
      {item.value > 0 && (
        <span className="text-[10px] text-default-400 dark:text-zinc-500">
          ({((item.value / total) * 100).toFixed(1)}%)
        </span>
      )}
    </>
  );

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.map((item, index) => (
        <div key={item.name} className="flex items-center gap-2 group">
          {renderItem ? renderItem(item, index) : defaultRender(item)}
        </div>
      ))}
    </div>
  );
}