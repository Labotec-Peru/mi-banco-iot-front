import { useState, useCallback, useMemo } from 'react';
import {
    useGetMeterModelsQuery,
    useCreateMeterModelMutation,
    useUpdateMeterModelMutation,
    useDeleteMeterModelMutation,
    type MeterModel,
    type MeterModelFilters,
} from '../services/meterModelsApi';
import { addToast } from '@heroui/react';

interface UseMeterModelsReturn {
    models: MeterModel[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: MeterModelFilters;
    setFilters: (filters: MeterModelFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: MeterModel }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: MeterModel }>;
    remove: (id: number) => Promise<{ success: boolean }>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => MeterModel[];
    filteredModels: MeterModel[];
}

export function useMeterModels(): UseMeterModelsReturn {
    const [filters, setFiltersState] = useState<MeterModelFilters>({
        page: 0,
        size: 15,
    });
    const { data, isLoading, error, refetch } = useGetMeterModelsQuery(filters);
    const [createModel] = useCreateMeterModelMutation();
    const [updateModel] = useUpdateMeterModelMutation();
    const [deleteModel] = useDeleteMeterModelMutation();

    const setFilters = useCallback((newFilters: MeterModelFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    const getModelsData = (): MeterModel[] => {
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

        const models = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: models.length,
            page: 0,
            size: models.length || 15,
        };
    };

    const allModels = getModelsData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): MeterModel[] => {
        let filtered = [...allModels];
        
        if (filterValues.search) {
            const searchTerm = filterValues.search.toLowerCase();
            filtered = filtered.filter(model => 
                model.name.toLowerCase().includes(searchTerm) ||
                (model.description && model.description.toLowerCase().includes(searchTerm))
            );
        }

        if (filterValues.meterBrandId) {
            filtered = filtered.filter(model => 
                model.meterBrandId === Number(filterValues.meterBrandId)
            );
        }

        if (filterValues.status) {
            filtered = filtered.filter(model => 
                (model as any).status === filterValues.status
            );
        }

        return filtered;
    }, [allModels]);

    const filteredModels = useMemo(() => {
        return applyFilters({});
    }, [allModels, applyFilters]);

    const create = useCallback(async (data: any) => {
        try {
            console.log('🔍 Creando modelo con datos:', data);
            
            if (!data.meterBrandId) {
                addToast({
                    title: 'Error',
                    description: 'La marca es requerida',
                    color: 'danger',
                });
                return { success: false };
            }

            const meterBrandId = typeof data.meterBrandId === 'string' 
                ? parseInt(data.meterBrandId, 10) 
                : data.meterBrandId;

            const result = await createModel({
                name: data.name,
                description: data.description || '',
                meterBrandId: meterBrandId,
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Modelo creado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('❌ Error al crear:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al crear el modelo';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createModel, refetch]);
    const update = useCallback(async (id: number, data: any) => {
        try {
            console.log('🔍 Actualizando modelo con datos:', data);
            
            let meterBrandId = data.meterBrandId;
            if (meterBrandId && typeof meterBrandId === 'string') {
                meterBrandId = parseInt(meterBrandId, 10);
            }

            const result = await updateModel({
                id,
                data: {
                    name: data.name,
                    description: data.description || '',
                    meterBrandId: meterBrandId,
                },
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Modelo actualizado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('❌ Error al actualizar:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar el modelo';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateModel, refetch]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteModel(id).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Modelo eliminado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true };
        } catch (error: any) {
            console.error('❌ Error al eliminar:', error);
            const message = error?.data?.message || 'Error al eliminar el modelo';
            addToast({
                title: 'Error',
                description: message,
                color: 'danger',
            });
            return { success: false };
        }
    }, [deleteModel, refetch]);

    return {
        models: allModels,
        filteredModels: filteredModels,
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