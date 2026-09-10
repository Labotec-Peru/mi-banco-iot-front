import { useState, useCallback, useMemo } from 'react';
import {
    useGetReadingsQuery,
    useCreateReadingMutation,
    useLazyGetLastReadingQuery,
    useLazyGetMyReadingsByWaterMeterQuery,
    type Reading,
    type ReadingFilters,
} from '../services/readingsApi';
import { mapApiToLecturas } from '../services/lecturaMapper'; 
import type { Lectura } from '../types/lectura';
import { addToast } from '@heroui/react';

interface UseReadingsReturn {
    readings: Lectura[]; 
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: ReadingFilters;
    setFilters: (filters: ReadingFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: Reading }>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => Lectura[]; 
    filteredReadings: Lectura[]; 
    getLastReading: (waterMeterId: number) => Promise<Reading | null>;
    getMyReadings: (waterMeterId: number) => Promise<Reading[] | null>;
}

export function useReadings(): UseReadingsReturn {
   const [filters, setFiltersState] = useState<ReadingFilters>({
        page: 0,
        size: 15,
        waterMeterId: undefined,
        startDate: undefined,
        endDate: undefined,
        status: undefined,
        search: undefined, 
    });

     const { data, isLoading, error, refetch } = useGetReadingsQuery(filters, {
        refetchOnMountOrArgChange: true,
    });
    
    const [createReading] = useCreateReadingMutation();
    const [getLastReadingQuery] = useLazyGetLastReadingQuery();
    const [getMyReadingsQuery] = useLazyGetMyReadingsByWaterMeterQuery();

    const setFilters = useCallback((newFilters: ReadingFilters) => {
        setFiltersState(prev => {
            const cleanedFilters = Object.fromEntries(
                Object.entries(newFilters).filter(([_, value]) => value !== undefined)
            );
            return { ...prev, ...cleanedFilters };
        });
    }, []);

     const getReadingsData = (): Lectura[] => {
        if (!data) return [];
        if (data && 'content' in data && Array.isArray(data.content)) {
            return mapApiToLecturas(data.content);
        }
        if (Array.isArray(data)) {
            return mapApiToLecturas(data); 
        }
        return [];
    };

    const getPaginationData = () => {
        if (!data) {
            return {
                totalPages: 0,
                totalElements: 0,
                page: filters.page || 0,
                size: filters.size || 15,
            };
        }

        if ('totalPages' in data && 'totalElements' in data) {
            return {
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0,
                page: data.number || filters.page || 0,
                size: data.size || filters.size || 15,
            };
        }

        const readings = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: readings.length,
            page: 0,
            size: readings.length || 15,
        };
    };

    const allReadings = getReadingsData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): Reading[] => {
        let filtered = [...allReadings];
        
        if (filterValues.search) {
            const searchTerm = filterValues.search.toLowerCase();
            filtered = filtered.filter(reading => 
                reading.waterMeter?.serialNumber?.toLowerCase().includes(searchTerm) ||
                reading.value.toString().includes(searchTerm)
            );
        }

        if (filterValues.waterMeterId) {
            filtered = filtered.filter(reading => 
                reading.waterMeterId === Number(filterValues.waterMeterId)
            );
        }

        if (filterValues.startDate) {
            filtered = filtered.filter(reading => 
                reading.readingDate >= filterValues.startDate!
            );
        }

        if (filterValues.endDate) {
            filtered = filtered.filter(reading => 
                reading.readingDate <= filterValues.endDate!
            );
        }

        if (filterValues.status) {
            filtered = filtered.filter(reading => 
                reading.status === filterValues.status
            );
        }

        return filtered;
    }, [allReadings]);

    const filteredReadings = useMemo(() => {
        return applyFilters({});
    }, [allReadings, applyFilters]);

    const create = useCallback(async (data: any) => {
        try {
            const result = await createReading({
                waterMeterId: Number(data.waterMeterId),
                value: Number(data.value),
                readingDate: data.readingDate || new Date().toISOString(),
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Lectura registrada exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al crear lectura:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al registrar la lectura';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createReading, refetch]);

    const getLastReading = useCallback(async (waterMeterId: number) => {
        try {
            const result = await getLastReadingQuery(waterMeterId).unwrap();
            return result;
        } catch (error) {
            console.error('Error al obtener última lectura:', error);
            return null;
        }
    }, [getLastReadingQuery]);

    const getMyReadings = useCallback(async (waterMeterId: number) => {
        try {
            const result = await getMyReadingsQuery(waterMeterId).unwrap();
            return result;
        } catch (error) {
            console.error('Error al obtener lecturas del usuario:', error);
            return null;
        }
    }, [getMyReadingsQuery]);

    return {
        readings: allReadings,
        filteredReadings: filteredReadings,
        pagination,
        isLoading,
        error,
        filters,
        setFilters,
        create,
        refetch,
        applyFilters,
        getLastReading,
        getMyReadings,
    };
}