import { useMemo } from "react";

export interface ChartDataPoint {
    time: string;
    fullDate: string;
    volumen: number;
    flujo: number;
    promedio?: number;
}

function extractValue(reading: any, attributeName: string): number {
    const directField = {
        cflow: "flow",
        tflow: "totalFlow",
    }[attributeName];

    if (directField && reading[directField] !== undefined) {
        const num = Number(reading[directField]);
        if (!isNaN(num) && num !== 0) return num;
    }

    if (Array.isArray(reading.values)) {
        const found = reading.values.find(
            (v: any) => v.attributeName === attributeName
        );
        if (found?.value !== undefined) {
            const num = parseFloat(found.value);
            if (!isNaN(num)) return num;
        }
    }

    return 0;
}

export function transformReadingsToChartData(readings: any[]): ChartDataPoint[] {
    if (!readings || readings.length === 0) return [];

    const sorted = [...readings]
        .map((r) => {
            const dateField = r.readingDate || r.readingAt;
            const date = dateField ? new Date(dateField) : null;
            return date && !isNaN(date.getTime()) ? { reading: r, date } : null;
        })
        .filter((x): x is { reading: any; date: Date } => x !== null)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const points: ChartDataPoint[] = sorted.map(({ reading, date }) => {
        const dateField = reading.readingDate || reading.readingAt;
        return {
            time: dateField,        
            fullDate: dateField,    
            flujo: extractValue(reading, "cflow"),
            volumen: extractValue(reading, "tflow"),
        };
    });

    const promedioGlobal =
        points.length > 0
            ? points.reduce((sum, p) => sum + p.flujo, 0) / points.length
            : 0;

    return points.map((p) => ({ ...p, promedio: promedioGlobal }));
}

export function useChartData(readings: any): ChartDataPoint[] {
    return useMemo(() => {
        if (!readings) return [];
        const rawReadings = Array.isArray(readings)
            ? readings
            : readings?.content ?? [];
        return transformReadingsToChartData(rawReadings);
    }, [readings]);
}