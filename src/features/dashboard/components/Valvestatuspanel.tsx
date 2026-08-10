import { useState } from "react";
import { Chip, Switch, Divider } from "@heroui/react";

type ValveStatusPanelProps = {
    /** L/min o bar según lo que midan */
    pressure: number;
    /** rango normal de presión, para pintar la barra */
    pressureRange: [number, number];
    initialOpen?: boolean;
    onToggle?: (open: boolean) => void;
    lastChanged?: string;
};

export default function ValveStatusPanel({
    pressure,
    pressureRange,
    initialOpen = true,
    onToggle,
    lastChanged = "Hace 3 h",
}: ValveStatusPanelProps) {
    const [isOpen, setIsOpen] = useState(initialOpen);

    const [min, max] = pressureRange;
    const inRange = pressure >= min && pressure <= max;
    const percent = Math.min(
        100,
        Math.max(0, ((pressure - min) / (max - min)) * 100)
    );

    const handleChange = (value: boolean) => {
        setIsOpen(value);
        onToggle?.(value);
    };

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <Chip
                        size="sm"
                        variant="flat"
                        color={isOpen ? "primary" : "default"}
                        className="font-semibold"
                    >
                        {isOpen ? "Abierta" : "Cerrada"}
                    </Chip>

                    <p className="mt-2 text-[11px] text-default-400">
                        Último cambio: {lastChanged}
                    </p>
                </div>

                <Switch
                    isSelected={isOpen}
                    onValueChange={handleChange}
                    color="primary"
                    aria-label="Abrir o cerrar válvula"
                />
            </div>

            <Divider className="my-4" />

            <div>
                <div className="flex items-baseline justify-between">
                    <p className="text-xs font-medium text-default-500">
                        Presión de línea
                    </p>
                    <p
                        className={`text-xs font-semibold ${
                            inRange ? "text-primary" : "text-danger"
                        }`}
                    >
                        {inRange ? "Normal" : "Fuera de rango"}
                    </p>
                </div>

                <div className="mt-2 flex items-end gap-1.5">
                    <span className="text-2xl font-bold text-foreground">
                        {pressure}
                    </span>
                    <span className="pb-0.5 text-xs text-default-400">
                        bar
                    </span>
                </div>

                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-default-100">
                    <div
                        className={`h-full rounded-full transition-all ${
                            inRange ? "bg-primary" : "bg-danger"
                        }`}
                        style={{ width: `${percent}%` }}
                    />
                </div>

                <div className="mt-1 flex justify-between text-[10px] text-default-400">
                    <span>{min} bar</span>
                    <span>{max} bar</span>
                </div>
            </div>
        </div>
    );
}