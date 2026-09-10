import { useState, useCallback } from 'react';
import {
    useGetMeterBrandsQuery,
    useCreateMeterBrandMutation,
    useUpdateMeterBrandMutation,
    useDeleteMeterBrandMutation,
    type MeterBrand,
    type MeterBrandFilters,
} from '../services/meterBrandsApi';
import { addToast } from '@heroui/react';

interface UseMeterBrandsReturn {
    brands: MeterBrand[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: MeterBrandFilters;
    setFilters: (filters: MeterBrandFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: MeterBrand }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: MeterBrand }>;
    remove: (id: number) => Promise<{ success: boolean }>;
    refetch: () => void;
    filteredBrands: MeterBrand[];
    applyFilters: (filterValues: Record<string, string>) => MeterBrand[];
}

export function useMeterBrands(): UseMeterBrandsReturn {
    const [filters, setFiltersState] = useState<MeterBrandFilters>({
        page: 0,
        size: 15,
    });

    const { data, isLoading, error, refetch } = useGetMeterBrandsQuery({
        page: 0,
        size: 1000,
    });
    const [createBrand] = useCreateMeterBrandMutation();
    const [updateBrand] = useUpdateMeterBrandMutation();
    const [deleteBrand] = useDeleteMeterBrandMutation();

    const setFilters = useCallback((newFilters: MeterBrandFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    const getBrandsData = (): MeterBrand[] => {
        if (!data) return [];
                
        if (Array.isArray(data)) {
            return data;
        }
        
        if (data && !Array.isArray(data) && 'content' in data && Array.isArray(data.content)) {
            return data.content;
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
        if (!Array.isArray(data) && 'totalPages' in data && 'totalElements' in data) {
            return {
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0,
                page: data.number || filters.page || 0,
                size: data.size || filters.size || 15,
            };
        }
        const brands = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: brands.length,
            page: 0,
            size: brands.length || 15,
        };
    };

    const allBrands = getBrandsData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): MeterBrand[] => {
        let filtered = [...allBrands];
        if (filterValues.search) {
            const searchTerm = filterValues.search.toLowerCase();
            filtered = filtered.filter(brand => 
                brand.name.toLowerCase().includes(searchTerm) ||
                (brand.description && brand.description.toLowerCase().includes(searchTerm))
            );
        }
        if (filterValues.manufacturerCompanyId) {
            filtered = filtered.filter(brand => 
                brand.manufacturerCompanyId === Number(filterValues.manufacturerCompanyId)
            );
        }
        if (filterValues.status) {
            filtered = filtered.filter(brand => 
                brand.status === filterValues.status
            );
        }
        return filtered;
    }, [allBrands]);
    const brands = allBrands;


    const create = useCallback(async (data: any) => {
        try {
            if (!data.manufacturerCompanyId) {
                addToast({
                    title: 'Error',
                    description: 'La empresa fabricante es requerida',
                    color: 'danger',
                });
                return { success: false };
            }
            const manufacturerCompanyId = typeof data.manufacturerCompanyId === 'string' 
                ? parseInt(data.manufacturerCompanyId, 10) 
                : data.manufacturerCompanyId;

            const result = await createBrand({
                name: data.name,
                description: data.description,
                manufacturerCompanyId: manufacturerCompanyId, 
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Marca creada exitosamente',
                color: 'success',
            });
            await refetch(); 
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al crear:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al crear la marca';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createBrand, refetch]);

    const update = useCallback(async (id: number, data: any) => {
        try {
            
            let manufacturerCompanyId = data.manufacturerCompanyId;
            if (manufacturerCompanyId && typeof manufacturerCompanyId === 'string') {
                manufacturerCompanyId = parseInt(manufacturerCompanyId, 10);
            }

            const result = await updateBrand({
                id,
                data: {
                    name: data.name,
                    description: data.description,
                    manufacturerCompanyId: manufacturerCompanyId,
                },
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Marca actualizada exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al actualizar:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar la marca';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateBrand, refetch]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteBrand(id).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Marca eliminada exitosamente',
                color: 'success',
            });
            await refetch(); 
            return { success: true };
        } catch (error: any) {
            console.error('Error al eliminar:', error);
            const message = error?.data?.message || 'Error al eliminar la marca';
            addToast({
                title: 'Error',
                description: message,
                color: 'danger',
            });
            return { success: false };
        }
    }, [deleteBrand, refetch]);

    return {
        brands, 
        filteredBrands: brands, 
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