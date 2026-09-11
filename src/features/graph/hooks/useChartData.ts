import { useMemo } from "react";
import { getResolution, floorToBucket, formatBucketLabel } from "../utils/chartResolution";

export interface ChartDataPoint {
    time: string;
    fullDate: string;
    volumen: number;
    flujo: number;
    promedio?: number;
}

/**
 * El medidor reporta en Wialon IPS v2.0:
 *   - cflow: mL/h  → dividir entre 1000 para obtener L/h
 *   - tflow: mL    → dividir entre 1000 para obtener L (acumulado)
 *   - trflow: mL   → (no usado)
 */
function mlToL(value: number | string | undefined): number {
    const num = Number(value);
    if (isNaN(num)) return 0;
    return num / 1000;
}

function extractFlujo(reading: any): number {
    let flujo = Number(reading.flow) || 0;
    if (flujo === 0 && Array.isArray(reading.values)) {
        const cflow = reading.values.find((v: any) => v.attributeName === "cflow");
        if (cflow?.value) flujo = parseFloat(cflow.value) || 0;
    }
    return flujo; // mL/h
}

function extractVolumen(reading: any): number {
    let volumen = Number(reading.totalFlow) || 0;
    if (volumen === 0 && Array.isArray(reading.values)) {
        const tflow = reading.values.find((v: any) => v.attributeName === "tflow");
        if (tflow?.value) volumen = parseFloat(tflow.value) || 0;
    }
    return volumen; // mL (acumulado)
}

export function transformReadingsToChartData(
    readings: any[],
    startDate?: string,
    endDate?: string
): ChartDataPoint[] {
    if (!readings || readings.length === 0) return [];

    const resolution = getResolution(startDate, endDate);

    const sorted = [...readings]
        .map((r) => {
            const dateField = r.readingDate || r.readingAt;
            const date = dateField ? new Date(dateField) : null;
            return date && !isNaN(date.getTime()) ? { reading: r, date } : null;
        })
        .filter((x): x is { reading: any; date: Date } => x !== null)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    interface Bucket {
        date: Date;
        flujoSum: number;
        flujoCount: number;
        volumenMax: number;
        volumenMin: number;
        firstVolumen: number;
        lastVolumen: number;
    }

    const buckets = new Map<string, Bucket>();

    for (const { reading, date } of sorted) {
        const bucketDate = floorToBucket(date, resolution.unit, resolution.amount);
        const key = bucketDate.toISOString();

        const flujo = mlToL(extractFlujo(reading));     
        const volumen = mlToL(extractVolumen(reading)); 

        let bucket = buckets.get(key);
        if (!bucket) {
            bucket = {
                date: bucketDate,
                flujoSum: 0,
                flujoCount: 0,
                volumenMax: volumen,
                volumenMin: volumen,
                firstVolumen: volumen,
                lastVolumen: volumen,
            };
            buckets.set(key, bucket);
        }

        bucket.flujoSum += flujo;
        bucket.flujoCount += 1;
        bucket.volumenMax = Math.max(bucket.volumenMax, volumen);
        bucket.volumenMin = Math.min(bucket.volumenMin, volumen);
        bucket.lastVolumen = volumen;
    }

    const points: ChartDataPoint[] = Array.from(buckets.values())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((b) => ({
            time: formatBucketLabel(b.date, resolution),
            fullDate: b.date.toISOString(),
            flujo: b.flujoCount > 0 ? b.flujoSum / b.flujoCount : 0,
            volumen: Math.max(0, b.volumenMax - b.volumenMin),
        }));

    const promedioGlobal =
        points.length > 0
            ? points.reduce((sum, p) => sum + p.flujo, 0) / points.length
            : 0;

    return points.map((p) => ({ ...p, promedio: promedioGlobal }));
}

export function useChartData(
    readings: any,
    startDate?: string,
    endDate?: string
): ChartDataPoint[] {
    return useMemo(() => {
        if (!readings) return [];
        const rawReadings = Array.isArray(readings)
            ? readings
            : readings?.content ?? [];
        return transformReadingsToChartData(rawReadings, startDate, endDate);
    }, [readings, startDate, endDate]);
}