import { useMemo } from "react";

export interface ChartDataPoint {
  time: string;     
  fullDate: string;
  volumen: number;
  flujo: number;
  promedio?: number;
}

function mlToL(value: number | string | undefined): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num / 1000;
}


export function transformReadingsToChartData(readings: any[]): ChartDataPoint[] {
  if (!readings || readings.length === 0) return [];

  return [...readings]
    .sort(
      (a, b) =>
        new Date(a.readingDate || a.readingAt).getTime() -
        new Date(b.readingDate || b.readingAt).getTime()
    )
    .map((reading) => {
      const dateField = reading.readingDate || reading.readingAt;
      if (!dateField) return null;

      const date = new Date(dateField);
      if (isNaN(date.getTime())) return null;

      let flujoML = Number(reading.flow) || 0;
      let volumenML = Number(reading.totalFlow) || 0;

      if (reading.values && Array.isArray(reading.values)) {
        if (flujoML === 0) {
          const cflow = reading.values.find((v: any) => v.attributeName === "cflow");
          if (cflow?.value) flujoML = parseFloat(cflow.value) || 0;
        }
        if (volumenML === 0) {
          const tflow = reading.values.find((v: any) => v.attributeName === "tflow");
          if (tflow?.value) volumenML = parseFloat(tflow.value) || 0;
        }
      }

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");

      return {
        time: `${day}/${month}`,
        fullDate: dateField,
        volumen: mlToL(volumenML),
        flujo: mlToL(flujoML),
      };
    })
    .filter((item): item is ChartDataPoint => item !== null);
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