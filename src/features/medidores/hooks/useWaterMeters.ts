import { useState, useCallback } from 'react';
import {
    useGetWaterMetersQuery,
    useCreateWaterMeterMutation,
    useUpdateWaterMeterMutation,
    useDeleteWaterMeterMutation,
} from '../services/waterMetersApi';
import type { WaterMeterFilters, CreateWaterMeterRequest, UpdateWaterMeterRequest } from '../types/waterMeter.types';

export const useWaterMeters = () => {
    const [filters, setFilters] = useState<WaterMeterFilters>({
        page: 0,
        size: 15,
    });

    const { data, isLoading, error, refetch } = useGetWaterMetersQuery(filters);
    const [createMeter] = useCreateWaterMeterMutation();
    const [updateMeter] = useUpdateWaterMeterMutation();
    const [deleteMeter] = useDeleteWaterMeterMutation();

    const create = useCallback(async (data: CreateWaterMeterRequest) => {
        try {
            const result = await createMeter(data).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('Error al crear:', error);
            throw error;
        }
    }, [createMeter]);

    const update = useCallback(async (id: number, data: UpdateWaterMeterRequest) => {
        try {
            const result = await updateMeter({ id, data }).unwrap();
            return { success: true, data: result };
        } catch (error) {
            console.error('Error al actualizar:', error);
            throw error;
        }
    }, [updateMeter]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteMeter(id).unwrap();
            return { success: true };
        } catch (error) {
            console.error('Error al eliminar:', error);
            throw error;
        }
    }, [deleteMeter]);

    return {
        waterMeters: data?.content || [],
        pagination: {
            totalPages: data?.totalPages || 0,
            totalElements: data?.totalElements || 0,
            page: filters.page || 0,
            size: filters.size || 15,
        },
        isLoading,
        error,
        filters,
        setFilters,
        refetch,
        create,
        update,
        remove,
    };
};