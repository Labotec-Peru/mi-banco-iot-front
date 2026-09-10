import { useState, useCallback, useMemo } from 'react';
import {
    useGetAttachmentsQuery,
    useCreateAttachmentMutation,
    useUpdateAttachmentMutation,
    useDeleteAttachmentMutation,
    useGetAttachmentByIdQuery,
    type Attachment,
    type AttachmentFilters,
} from '../services/attachmentApi';
import { addToast } from '@heroui/react';

interface UseAttachmentsReturn {
    attachments: Attachment[];
    allAttachments: Attachment[]; 
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: AttachmentFilters;
    setFilters: (filters: AttachmentFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: Attachment }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: Attachment }>;
    remove: (id: number) => Promise<{ success: boolean }>;
    getAttachmentById: (id: number) => Promise<Attachment | null>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => Attachment[];
    filteredAttachments: Attachment[];
    getAttachmentOptions: () => SelectOption[]; 
}

export interface SelectOption {
    value: string;
    label: string;
}

export function useAttachments(): UseAttachmentsReturn {
    const [filters, setFiltersState] = useState<AttachmentFilters>({
        page: 0,
        size: 1000, 
        sortBy: 'created',
        sortDir: 'desc',
    });

    const { data, isLoading, error, refetch } = useGetAttachmentsQuery(filters);
    const [createAttachment] = useCreateAttachmentMutation();
    const [updateAttachment] = useUpdateAttachmentMutation();
    const [deleteAttachment] = useDeleteAttachmentMutation();

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const { refetch: refetchAttachment } = useGetAttachmentByIdQuery(selectedId!, {
        skip: selectedId === null,
    });

    const setFilters = useCallback((newFilters: AttachmentFilters) => {
        setFiltersState((prev: any) => ({ ...prev, ...newFilters }));
    }, []);

    const getAttachmentsData = (): Attachment[] => {
        if (!data) return [];
        if (data && 'content' in data && Array.isArray(data.content)) {
            return data.content;
        }
        return [];
    };

    const getPaginationData = () => {
        if (!data || !('totalPages' in data)) {
            return {
                totalPages: 0,
                totalElements: 0,
                page: filters.page || 0,
                size: filters.size || 15,
            };
        }
        return {
            totalPages: data.totalPages || 0,
            totalElements: data.totalElements || 0,
            page: data.page || filters.page || 0,
            size: data.size || filters.size || 15,
        };
    };

    const allAttachments = getAttachmentsData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): Attachment[] => {
        let filtered = [...allAttachments];
        
        if (filterValues.search) {
            const search = filterValues.search.toLowerCase();
            filtered = filtered.filter(attachment => 
                attachment.filename?.toLowerCase().includes(search) ||
                attachment.description?.toLowerCase().includes(search) ||
                attachment.fileType?.toLowerCase().includes(search)
            );
        }

        if (filterValues.fileType) {
            filtered = filtered.filter(attachment => 
                attachment.fileType === filterValues.fileType
            );
        }

        return filtered;
    }, [allAttachments]);

    const filteredAttachments = useMemo(() => {
        return applyFilters({});
    }, [allAttachments, applyFilters]);

    const getAttachmentOptions = useCallback((): SelectOption[] => {
        return allAttachments.map(attachment => ({
            value: String(attachment.id),
            label: `${attachment.filename}${attachment.description ? ` - ${attachment.description}` : ''}`,
        }));
    }, [allAttachments]);

    const create = useCallback(async (data: any) => {
        try {
            const result = await createAttachment(data).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Attachment creado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al crear attachment:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al crear el attachment';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createAttachment, refetch]);

    const update = useCallback(async (id: number, data: any) => {
        try {
            const result = await updateAttachment({ id, data }).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Attachment actualizado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al actualizar attachment:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar el attachment';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateAttachment, refetch]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteAttachment(id).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Attachment eliminado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true };
        } catch (error: any) {
            console.error('Error al eliminar attachment:', error);
            addToast({
                title: 'Error',
                description: error?.data?.message || 'Error al eliminar el attachment',
                color: 'danger',
            });
            return { success: false };
        }
    }, [deleteAttachment, refetch]);

    const getAttachmentById = useCallback(async (id: number) => {
        try {
            setSelectedId(id);
            const result = await refetchAttachment();
            if (result.data) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error('Error al obtener attachment:', error);
            return null;
        }
    }, [refetchAttachment]);

    return {
        attachments: allAttachments,
        allAttachments, 
        pagination,
        isLoading,
        error,
        filters,
        setFilters,
        create,
        update,
        remove,
        getAttachmentById,
        refetch,
        applyFilters,
        filteredAttachments,
        getAttachmentOptions, 
    };
}