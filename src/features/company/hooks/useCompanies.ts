import { useState, useCallback } from 'react';
import {
    useGetCompaniesQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    type Company,
    type CompanyFilters,
} from '../services/companyApi';
import { addToast } from '@heroui/react';

interface UseCompaniesReturn {
    companies: Company[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: CompanyFilters;
    setFilters: (filters: CompanyFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: Company }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: Company }>;
    remove: (id: number) => Promise<{ success: boolean }>;
    refetch: () => void;
}

export function useCompanies(): UseCompaniesReturn {
    const [filters, setFiltersState] = useState<CompanyFilters>({
        page: 0,
        size: 15,
    });


    const { data, isLoading, error, refetch } = useGetCompaniesQuery(filters);
    
    
    const [createCompany] = useCreateCompanyMutation();
    const [updateCompany] = useUpdateCompanyMutation();
    const [deleteCompany] = useDeleteCompanyMutation();

    const setFilters = useCallback((newFilters: CompanyFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);

    const getCompaniesData = (): Company[] => {
        if (!data) return [];
        if (!Array.isArray(data) && data.content && Array.isArray(data.content)) {
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

        if (!Array.isArray(data) && 'totalPages' in data && 'totalElements' in data) {
            return {
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0,
                page: data.number || filters.page || 0,
                size: data.size || filters.size || 15,
            };
        }

        const companies = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: companies.length,
            page: 0,
            size: companies.length || 15,
        };
    };

    const companies = getCompaniesData();
    const pagination = getPaginationData();


    const create = useCallback(async (data: any) => {
        try {
            const tenantAccess = data.tenantAccess || 
                               data.name?.toLowerCase().replace(/\s+/g, '-') || 
                               `tenant-${Date.now()}`;

            const result = await createCompany({
                name: data.name,
                description: data.description,
                address: data.address,
                phone: data.phone,
                email: data.email,
                website: data.website,
                logo: data.logo,
                bannerUrl: data.bannerUrl,
                taxIdentifierType: data.taxIdentifierType,
                taxIdentifierValue: data.taxIdentifierValue,
                phones: data.phones ? data.phones.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
                emails: data.emails ? data.emails.split(',').map((e: string) => e.trim()).filter(Boolean) : [],
                maxTenantsCreated: data.maxTenantsCreated ? Number(data.maxTenantsCreated) : undefined,
                maxDevicesCreated: data.maxDevicesCreated ? Number(data.maxDevicesCreated) : undefined,
                maxUsersCreated: data.maxUsersCreated ? Number(data.maxUsersCreated) : undefined,
                maxDriversCreated: data.maxDriversCreated ? Number(data.maxDriversCreated) : undefined,
                tenantAccess: tenantAccess,
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Empresa creada exitosamente',
                color: 'success',
            });
            return { success: true, data: result };
        } catch (error: any) {
            const message = error?.data?.message || error?.data?.errors || 'Error al crear la empresa';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createCompany]);

    const update = useCallback(async (id: number, data: any) => {
        try {
            const tenantAccess = data.tenantAccess || 
                               data.name?.toLowerCase().replace(/\s+/g, '-') || 
                               `tenant-${Date.now()}`;

            const result = await updateCompany({
                id,
                data: {
                    name: data.name,
                    description: data.description,
                    address: data.address,
                    phone: data.phone,
                    email: data.email,
                    website: data.website,
                    logo: data.logo,
                    bannerUrl: data.bannerUrl,
                    taxIdentifierType: data.taxIdentifierType,
                    taxIdentifierValue: data.taxIdentifierValue,
                    phones: data.phones ? data.phones.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
                    emails: data.emails ? data.emails.split(',').map((e: string) => e.trim()).filter(Boolean) : [],
                    maxTenantsCreated: data.maxTenantsCreated ? Number(data.maxTenantsCreated) : undefined,
                    maxDevicesCreated: data.maxDevicesCreated ? Number(data.maxDevicesCreated) : undefined,
                    maxUsersCreated: data.maxUsersCreated ? Number(data.maxUsersCreated) : undefined,
                    maxDriversCreated: data.maxDriversCreated ? Number(data.maxDriversCreated) : undefined,
                    status: data.status,
                    tenantAccess: tenantAccess,
                },
            }).unwrap();
            
            addToast({
                title: 'Éxito',
                description: 'Empresa actualizada exitosamente',
                color: 'success',
            });
            return { success: true, data: result };
        } catch (error: any) {
            console.error('❌ Error al actualizar:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar la empresa';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateCompany]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteCompany(id).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Empresa eliminada exitosamente',
                color: 'success',
            });
            return { success: true };
        } catch (error: any) {
            console.error('❌ Error al eliminar:', error);
            const message = error?.data?.message || 'Error al eliminar la empresa';
            addToast({
                title: 'Error',
                description: message,
                color: 'danger',
            });
            return { success: false };
        }
    }, [deleteCompany]);

    return {
        companies, 
        pagination, 
        isLoading,
        error,
        filters,
        setFilters,
        create,
        update,
        remove,
        refetch,
    };
}