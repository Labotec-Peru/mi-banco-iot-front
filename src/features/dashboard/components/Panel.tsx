import type { ReactNode } from "react";

type PanelProps = {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export default function Panel({ title, subtitle, action, className = "", children }: PanelProps) {
  return (
    <div
      className={`rounded-3xl bg-content1  shadow-sm p-5 flex flex-col ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {subtitle && <p className="text-xs text-default-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}