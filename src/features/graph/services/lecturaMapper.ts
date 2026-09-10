import type { Lectura } from "../types/lectura";

interface ApiReading {
    id: number;
    waterMeterId: number;
    title: string;
    obisCode: string;
    readingAt: string;
    sourceIp: string | null;
    values: Array<{
        id: number;
        attributeName: string;
        value: string;
        recordedAt: string;
    }>;
}

const getValueFromValues = (values: ApiReading['values'], attributeName: string): string | undefined => {
    const found = values.find(v => v.attributeName === attributeName);
    return found?.value;
};

export const mapApiToLectura = (apiReading: ApiReading): Lectura => {
    const volumeValue = getValueFromValues(apiReading.values, 'v') || '0';
    const flowValue = getValueFromValues(apiReading.values, 'cflow') || '0';
    const totalFlow = getValueFromValues(apiReading.values, 'tflow') || '0';
    const reverseFlow = getValueFromValues(apiReading.values, 'trflow') || '0';
    
    return {
        id: apiReading.id,
        waterMeterId: apiReading.waterMeterId,
        value: parseFloat(volumeValue),
        readingDate: apiReading.readingAt,
        status: 'ACTIVE',
        createdAt: apiReading.readingAt,
        updatedAt: apiReading.readingAt,
        title: apiReading.title,
        obisCode: apiReading.obisCode,
        values: apiReading.values,
        flow: parseFloat(flowValue), 
        totalFlow: parseFloat(totalFlow), 
        reverseFlow: parseFloat(reverseFlow), 
        waterMeter: undefined,
    };
};

export const mapApiToLecturas = (apiReadings: ApiReading[]): Lectura[] => {
    return apiReadings.map(mapApiToLectura);
};