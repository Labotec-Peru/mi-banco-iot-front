import { Chip } from "@heroui/react";
import { AltArrowRight, Bolt, Danger } from "@solar-icons/react";

type AlertLevel = "critical" | "warning" | "none";

type Device = {
    id: string;
    location: string;
    alertLevel: AlertLevel;
    alertMessage?: string;
    status: "active" | "inactive";
};

type DeviceListPanelProps = {
    devices: Device[];
    onSelectDevice?: (deviceId: string) => void;
    maxItems?: number;
};

function getLevelConfig(level: AlertLevel) {
    switch (level) {
        case "critical":
            return {
                dot: "bg-danger-500",
                ring: "ring-danger-500/15",
                iconBg: "bg-danger-500/10",
                iconColor: "text-danger-500",
                chipColor: "danger" as const,
                label: "Crítica",
            };
        case "warning":
            return {
                dot: "bg-warning-500",
                ring: "ring-warning-500/15",
                iconBg: "bg-warning-500/10",
                iconColor: "text-warning-500",
                chipColor: "warning" as const,
                label: "Advertencia",
            };
        default:
            return {
                dot: "bg-default-300 dark:bg-default-600",
                ring: "ring-default-200/40",
                iconBg: "bg-default-100 dark:bg-default-500/10",
                iconColor: "text-default-400",
                chipColor: "default" as const,
                label: "Normal",
            };
    }
}

export default function DeviceListPanel({
    devices,
    onSelectDevice,
    maxItems = 4,
}: DeviceListPanelProps) {
    const alerted = devices.filter((d) => d.alertLevel !== "none");
    const visible = alerted.slice(0, maxItems);
    const remaining = alerted.length - visible.length;

    if (alerted.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                <div className="rounded-full bg-success-500/10 p-3">
                    <Bolt size={20} className="text-success-500" />
                </div>
                <p className="text-xs text-default-400">
                    Todos los dispositivos operan con normalidad
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between pb-3">
                <p className="text-xs font-medium text-default-400">
                    {alerted.length} dispositivo{alerted.length > 1 ? "s" : ""} con alertas
                </p>
                <span className="flex items-center gap-1 text-[10px] text-danger-500">
                    <Danger size={12} weight="Bold" />
                    {devices.filter((d) => d.alertLevel === "critical").length} críticas
                </span>
            </div>

            <div className="flex flex-col divide-y divide-divider/10">
                {visible.map((device) => {
                    const config = getLevelConfig(device.alertLevel);

                    return (
                        <button
                            key={device.id}
                            type="button"
                            onClick={() => onSelectDevice?.(device.id)}
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                py-2.5
                                text-left
                                transition-colors
                                duration-150
                                hover:bg-content2/40
                                rounded-lg
                                px-2
                                -mx-2
                            "
                        >
                            <span
                                className={`h-2 w-2 shrink-0 rounded-full ${config.dot} ring-4 ${config.ring}`}
                            />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-foreground truncate">
                                        {device.id}
                                    </span>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color={config.chipColor}
                                        classNames={{
                                            base: "h-4 shrink-0",
                                            content: "px-1.5 text-[9px] font-medium",
                                        }}
                                    >
                                        {config.label}
                                    </Chip>
                                </div>
                                <p className="text-xs text-default-500 truncate">
                                    {device.alertMessage ?? device.location}
                                </p>
                            </div>

                            <AltArrowRight
                                size={14}
                                className="
                                    shrink-0
                                    text-default-300
                                    transition-all
                                    duration-200
                                    group-hover:translate-x-0.5
                                    group-hover:text-primary
                                    dark:group-hover:text-secondary
                                "
                            />
                        </button>
                    );
                })}
            </div>

            {remaining > 0 && (
                <button
                    type="button"
                    onClick={() => onSelectDevice?.("all")}
                    className="
                        mt-2
                        rounded-lg
                        border
                        border-dashed
                        border-divider
                        py-2
                        text-center
                        text-xs
                        text-default-400
                        transition-colors
                        hover:border-primary/30
                        hover:text-primary
                    "
                >
                    Ver {remaining} más
                </button>
            )}
        </div>
    );
}