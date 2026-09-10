import { useState, useCallback, useMemo } from 'react';
import {
    useGetMeterTypesQuery,
    useCreateMeterTypeMutation,
    useUpdateMeterTypeMutation,
    useDeleteMeterTypeMutation,
    type MeterType,
    type MeterTypeFilters,
} from '../services/meterTypesApi';
import { addToast } from '@heroui/react';

interface UseMeterTypesReturn {
    types: MeterType[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: MeterTypeFilters;
    setFilters: (filters: MeterTypeFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: MeterType }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: MeterType }>;
    remove: (id: number) => Promise<{ success: boolean }>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => MeterType[];
    filteredTypes: MeterType[];
}

export function useMeterTypes(): UseMeterTypesReturn {
    const [filters, setFiltersState] = useState<MeterTypeFilters>({
        page: 0,
        size: 15,
    });
    const { data, isLoading, error, refetch } = useGetMeterTypesQuery(filters);
    const [createType] = useCreateMeterTypeMutation();
    const [updateType] = useUpdateMeterTypeMutation();
    const [deleteType] = useDeleteMeterTypeMutation();

    const setFilters = useCallback((newFilters: MeterTypeFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    const getTypesData = (): MeterType[] => {
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

        const types = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: types.length,
            page: 0,
            size: types.length || 15,
        };
    };

    const allTypes = getTypesData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): MeterType[] => {
        let filtered = [...allTypes];
        
        if (filterValues.search) {
            const searchTerm = filterValues.search.toLowerCase();
            filtered = filtered.filter(type => 
                type.name.toLowerCase().includes(searchTerm) ||
                (type.abbreviation && type.abbreviation.toLowerCase().includes(searchTerm)) ||
                (type.description && type.description.toLowerCase().includes(searchTerm))
            );
        }

        if (filterValues.abbreviation) {
            filtered = filtered.filter(type => 
                type.abbreviation?.toLowerCase().includes(filterValues.abbreviation.toLowerCase())
            );
        }

        if (filterValues.status) {
            filtered = filtered.filter(type => 
                (type as any).status === filterValues.status
            );
        }

        return filtered;
    }, [allTypes]);

    const filteredTypes = useMemo(() => {
        return applyFilters({});
    }, [allTypes, applyFilters]);

    const create = useCallback(async (data: any) => {
        try {
            console.log('🔍 Creando tipo con datos:', data);

            const result = await createType({
                name: data.name,
                abbreviation: data.abbreviation || '',
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Tipo creado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('❌ Error al crear:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al crear el tipo';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createType, refetch]);

    const update = useCallback(async (id: number, data: any) => {
        try {
            console.log('🔍 Actualizando tipo con datos:', data);

            const result = await updateType({
                id,
                data: {
                    name: data.name,
                    abbreviation: data.abbreviation || '',
                },
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Tipo actualizado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('❌ Error al actualizar:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar el tipo';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateType, refetch]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteType(id).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Tipo eliminado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true };
        } catch (error: any) {
            console.error('❌ Error al eliminar:', error);
            const message = error?.data?.message || 'Error al eliminar el tipo';
            addToast({
                title: 'Error',
                description: message,
                color: 'danger',
            });
            return { success: false };
        }
    }, [deleteType, refetch]);

    return {
        types: allTypes,
        filteredTypes: filteredTypes,
        pagination,
        isLoading,
        error,
        filters,
        setFilters,
        create,
        update,
        remove,
        refetch,
        applyFilters,
    };
}