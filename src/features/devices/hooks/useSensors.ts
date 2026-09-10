import { useState, useCallback, useMemo } from 'react';
import {
    useGetSensorsQuery,
    useCreateSensorMutation,
    useUpdateSensorMutation,
    type Sensor,
    type SensorFilters,
} from '../services/sensorsApi';
import { addToast } from '@heroui/react';

interface UseSensorsReturn {
    sensors: Sensor[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: SensorFilters;
    setFilters: (filters: SensorFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: Sensor }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: Sensor }>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => Sensor[];
    filteredSensors: Sensor[];
}

export function useSensors(): UseSensorsReturn {
    const [filters, setFiltersState] = useState<SensorFilters>({
        page: 0,
        size: 15,
    });
    const { data, isLoading, error, refetch } = useGetSensorsQuery(filters);
    const [createSensor] = useCreateSensorMutation();
    const [updateSensor] = useUpdateSensorMutation();

    const setFilters = useCallback((newFilters: SensorFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    const getSensorsData = (): Sensor[] => {
        if (!data) return [];
        if (data && 'content' in data && Array.isArray(data.content)) {
            return data.content;
        }
        if (Array.isArray(data)) {
            return data;
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

        const sensors = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: sensors.length,
            page: 0,
            size: sensors.length || 15,
        };
    };

    const allSensors = getSensorsData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): Sensor[] => {
        let filtered = [...allSensors];
        
        if (filterValues.search) {
            const searchTerm = filterValues.search.toLowerCase();
            filtered = filtered.filter(sensor => 
                sensor.serialNumber.toLowerCase().includes(searchTerm) ||
                (sensor.firmwareVersion && sensor.firmwareVersion.toLowerCase().includes(searchTerm))
            );
        }

        if (filterValues.meterBrandId) {
            filtered = filtered.filter(sensor => 
                sensor.meterBrandId === Number(filterValues.meterBrandId)
            );
        }

        if (filterValues.meterModelId) {
            filtered = filtered.filter(sensor => 
                sensor.meterModelId === Number(filterValues.meterModelId)
            );
        }

        if (filterValues.status) {
            filtered = filtered.filter(sensor => 
                sensor.status === filterValues.status
            );
        }

        return filtered;
    }, [allSensors]);

    const filteredSensors = useMemo(() => {
        return applyFilters({});
    }, [allSensors, applyFilters]);

    const create = useCallback(async (data: any) => {
        try {
            const result = await createSensor({
                serialNumber: data.serialNumber,
                meterBrandId: Number(data.meterBrandId),
                meterModelId: Number(data.meterModelId),
                firmwareVersion: data.firmwareVersion || '',
                imei: data.imei,
                devicePassword: data.devicePassword,
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Sensor creado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            const message = error?.data?.message || error?.data?.errors || 'Error al crear el sensor';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createSensor, refetch]);

    const update = useCallback(async (id: number, data: any) => {
        try {

            const updateData: any = {};
            if (data.serialNumber !== undefined) updateData.serialNumber = data.serialNumber;
            if (data.meterBrandId !== undefined) updateData.meterBrandId = Number(data.meterBrandId);
            if (data.meterModelId !== undefined) updateData.meterModelId = Number(data.meterModelId);
            if (data.firmwareVersion !== undefined) updateData.firmwareVersion = data.firmwareVersion;
            if (data.imei !== undefined) updateData.imei = data.imei;
            if (data.devicePassword !== undefined) updateData.devicePassword = data.devicePassword;
            

            const result = await updateSensor({
                id,
                data: updateData,
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Sensor actualizado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar el sensor';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateSensor, refetch]);

    return {
        sensors: allSensors,
        filteredSensors: filteredSensors,
        pagination,
        isLoading,
        error,
        filters,
        setFilters,
        create,
        update,
        refetch,
        applyFilters,
    };
}