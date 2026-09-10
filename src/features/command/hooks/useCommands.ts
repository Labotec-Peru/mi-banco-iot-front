// hooks/useCommands.ts
import { useState, useCallback, useMemo } from 'react';
import {
    useGetCommandsQuery,
    useCreateCommandMutation,
    useUpdateCommandStatusMutation,
    useLazyGetCommandByIdQuery,
    useLazyGetCommandsByWaterMeterQuery,
    type Command,
    type CommandFilters,
} from '../services/commandsApi';
import { addToast } from '@heroui/react';

interface UseCommandsReturn {
    commands: Command[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: CommandFilters;
    setFilters: (filters: CommandFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: Command }>;
    updateStatus: (id: number, status: string, errorMessage?: string) => Promise<{ success: boolean; data?: Command }>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => Command[];
    filteredCommands: Command[];
    getCommandsByWaterMeter: (waterMeterId: number) => Promise<Command[] | null>;
    getCommandById: (id: number) => Promise<Command | null>;
}

export function useCommands(): UseCommandsReturn {
    const [filters, setFiltersState] = useState<CommandFilters>({
        page: 0,
        size: 15,
    });

    const { data, isLoading, error, refetch } = useGetCommandsQuery(filters);
    const [createCommand] = useCreateCommandMutation();
    const [updateStatusCommand] = useUpdateCommandStatusMutation();

    const [getCommandByIdQuery] = useLazyGetCommandByIdQuery();
    const [getCommandsByWaterMeterQuery] = useLazyGetCommandsByWaterMeterQuery();

    const setFilters = useCallback((newFilters: CommandFilters) => {
        setFiltersState(prev => ({ ...prev, ...newFilters }));
    }, []);
    const getCommandsData = (): Command[] => {
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

        const commands = Array.isArray(data) ? data : [];
        return {
            totalPages: 1,
            totalElements: commands.length,
            page: 0,
            size: commands.length || 15,
        };
    };

    const allCommands = getCommandsData();
    const pagination = getPaginationData();

    const applyFilters = useCallback((filterValues: Record<string, string>): Command[] => {
        let filtered = [...allCommands];

        if (filterValues.search) {
            const searchTerm = filterValues.search.toLowerCase();
            filtered = filtered.filter(command =>
                command.waterMeter?.serialNumber?.toLowerCase().includes(searchTerm) ||
                command.type.toLowerCase().includes(searchTerm) ||
                command.id.toString().includes(searchTerm)
            );
        }

        if (filterValues.waterMeterId) {
            filtered = filtered.filter(command =>
                command.waterMeterId === Number(filterValues.waterMeterId)
            );
        }

        if (filterValues.type) {
            filtered = filtered.filter(command =>
                command.type === filterValues.type
            );
        }

        if (filterValues.status) {
            filtered = filtered.filter(command =>
                command.status === filterValues.status
            );
        }

        if (filterValues.priority) {
            filtered = filtered.filter(command =>
                command.priority === filterValues.priority
            );
        }

        if (filterValues.startDate) {
            filtered = filtered.filter(command =>
                command.createdAt && command.createdAt >= filterValues.startDate!
            );
        }

        if (filterValues.endDate) {
            filtered = filtered.filter(command =>
                command.createdAt && command.createdAt <= filterValues.endDate!
            );
        }

        return filtered;
    }, [allCommands]);

    const filteredCommands = useMemo(() => {
        return applyFilters({});
    }, [allCommands, applyFilters]);

    const create = useCallback(async (data: any) => {
        try {

            const result = await createCommand({
                waterMeterId: Number(data.waterMeterId),
                type: data.type,
                payload: data.payload || {},
                priority: data.priority || 'MEDIUM',
            }).unwrap();

            addToast({
                title: 'Éxito',
                description: 'Comando creado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al crear comando:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al crear el comando';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createCommand, refetch]);

    const updateStatus = useCallback(async (id: number, status: string, errorMessage?: string) => {
        try {
            console.log('🔍 Actualizando estado del comando:', { id, status, errorMessage });

            const result = await updateStatusCommand({
                id,
                data: {
                    status: status as any,
                    errorMessage,
                },
            }).unwrap();

            addToast({
                title: 'Éxito',
                description: `Comando ${status.toLowerCase()}`,
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            const message = error?.data?.message || 'Error al actualizar el estado del comando';
            addToast({
                title: 'Error',
                description: message,
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateStatusCommand, refetch]);
    const getCommandById = useCallback(async (id: number) => {
        try {
            const result = await getCommandByIdQuery(id).unwrap();
            return result;
        } catch (error) {
            console.error('Error al obtener comando:', error);
            return null;
        }
    }, [getCommandByIdQuery]);

    const getCommandsByWaterMeter = useCallback(async (waterMeterId: number) => {
        try {
            const result = await getCommandsByWaterMeterQuery(waterMeterId).unwrap();
            return result;
        } catch (error) {
            console.error('Error al obtener comandos del medidor:', error);
            return null;
        }
    }, [getCommandsByWaterMeterQuery]);

    return {
        commands: allCommands,
        filteredCommands: filteredCommands,
        pagination,
        isLoading,
        error,
        filters,
        setFilters,
        create,
        updateStatus,
        refetch,
        applyFilters,
        getCommandsByWaterMeter,
        getCommandById,
    };
}