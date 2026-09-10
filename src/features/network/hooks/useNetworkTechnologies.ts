import { useState, useCallback, useMemo } from 'react';
import {
    useGetNetworkTechnologiesQuery,
    useCreateNetworkTechnologyMutation,
    useUpdateNetworkTechnologyMutation,
    useDeleteNetworkTechnologyMutation,
    type NetworkTechnology,
    type NetworkTechnologyFilters,
} from '../services/networkTechnologiesApi';
import { addToast } from '@heroui/react';

interface UseNetworkTechnologiesReturn {
    technologies: NetworkTechnology[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: NetworkTechnologyFilters;
    setFilters: (filters: NetworkTechnologyFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: NetworkTechnology }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: NetworkTechnology }>;
    remove: (id: number) => Promise<{ success: boolean }>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => NetworkTechnology[];
    filteredTechnologies: NetworkTechnology[];
}

export function useNetworkTechnologies(): UseNetworkTechnologiesReturn {
    const [filters, setFiltersState] = useState<NetworkTechnologyFilters>({
        page: 0,
        size: 15,
    });
    const { data, isLoading, error, refetch } = useGetNetworkTechnologiesQuery(filters);
    const [createTech] = useCreateNetworkTechnologyMutation();
    const [updateTech] = useUpdateNetworkTechnologyMutation();
    const [deleteTech] = useDeleteNetworkTechnologyMutation();

    const setFilters = useCallback((newFilters: NetworkTechnologyFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    const getTechnologiesData = (): NetworkTechnology[] => {
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

        const technologies = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: technologies.length,
            page: 0,
            size: technologies.length || 15,
        };
    };

    const allTechnologies = getTechnologiesData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): NetworkTechnology[] => {
        let filtered = [...allTechnologies];
        
        if (filterValues.search) {
            const searchTerm = filterValues.search.toLowerCase();
            filtered = filtered.filter(tech => 
                tech.name.toLowerCase().includes(searchTerm) ||
                (tech.abbreviation && tech.abbreviation.toLowerCase().includes(searchTerm))
            );
        }

        if (filterValues.abbreviation) {
            filtered = filtered.filter(tech => 
                tech.abbreviation?.toLowerCase().includes(filterValues.abbreviation.toLowerCase())
            );
        }

        if (filterValues.status) {
            filtered = filtered.filter(tech => 
                tech.status === filterValues.status
            );
        }

        return filtered;
    }, [allTechnologies]);

    const filteredTechnologies = useMemo(() => {
        return applyFilters({});
    }, [allTechnologies, applyFilters]);

    const create = useCallback(async (data: any) => {
        try {
            console.log('🔍 Creando tecnología de red con datos:', data);

            const result = await createTech({
                name: data.name,
                abbreviation: data.abbreviation || '',
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Tecnología de red creada exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('❌ Error al crear:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al crear la tecnología de red';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createTech, refetch]);

    const update = useCallback(async (id: number, data: any) => {
        try {
            console.log('🔍 Actualizando tecnología de red con datos:', data);

            const result = await updateTech({
                id,
                data: {
                    name: data.name,
                    abbreviation: data.abbreviation || '',
                },
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Tecnología de red actualizada exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('❌ Error al actualizar:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar la tecnología de red';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateTech, refetch]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteTech(id).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Tecnología de red eliminada exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true };
        } catch (error: any) {
            console.error('❌ Error al eliminar:', error);
            const message = error?.data?.message || 'Error al eliminar la tecnología de red';
            addToast({
                title: 'Error',
                description: message,
                color: 'danger',
            });
            return { success: false };
        }
    }, [deleteTech, refetch]);

    return {
        technologies: allTechnologies,
        filteredTechnologies: filteredTechnologies,
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