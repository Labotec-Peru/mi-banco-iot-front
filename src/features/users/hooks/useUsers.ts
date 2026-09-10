import { useState, useCallback, useMemo } from 'react';
import {
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetUserByIdQuery,
    type User,
    type UserFilters,
} from '../services/userApi';
import { addToast } from '@heroui/react';

interface UseUsersReturn {
    users: User[];
    allUsers: User[];
    pagination: {
        totalPages: number;
        totalElements: number;
        page: number;
        size: number;
    };
    isLoading: boolean;
    error: any;
    filters: UserFilters;
    setFilters: (filters: UserFilters) => void;
    create: (data: any) => Promise<{ success: boolean; data?: User }>;
    update: (id: number, data: any) => Promise<{ success: boolean; data?: User }>;
    remove: (id: number) => Promise<{ success: boolean }>;
    getUserById: (id: number) => Promise<User | null>;
    refetch: () => void;
    applyFilters: (filterValues: Record<string, string>) => User[];
    filteredUsers: User[];
    getTechnicianOptions: () => SelectOption[]; 
}

export interface SelectOption {
    value: string;
    label: string;
}

export function useUsers(): UseUsersReturn {
    const [filters, setFiltersState] = useState<UserFilters>({
        page: 0,
        size: 1000,
        sortBy: 'created',
        sortDir: 'desc',
    });

    const { data, isLoading, error, refetch } = useGetUsersQuery();
    const [createUser] = useCreateUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const { refetch: refetchUser } = useGetUserByIdQuery(selectedUserId!, {
        skip: selectedUserId === null,
    });

    const setFilters = useCallback((newFilters: UserFilters) => {
        setFiltersState((prev: any) => ({ ...prev, ...newFilters }));
    }, []);

    const getUsersData = (): User[] => {
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

    const allUsers = getUsersData();
    const pagination = getPaginationData();

    const getTechnicianOptions = useCallback((): SelectOption[] => {
        const technicians = allUsers.filter(user => 
            user.roles?.some(role => 
                ['TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'].includes(role)
            )
        );
        
        return technicians.map(user => ({
            value: String(user.id),
            label: `${user.firstName} ${user.lastName}${user.documentNumber ? ` (${user.documentNumber})` : ''}`,
        }));
    }, [allUsers]);

    const applyFilters = useCallback((filterValues: Record<string, string>): User[] => {
        let filtered = [...allUsers];
        
        if (filterValues.search) {
            const search = filterValues.search.toLowerCase();
            filtered = filtered.filter(user => 
                user.firstName?.toLowerCase().includes(search) ||
                user.lastName?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                user.documentNumber?.includes(search)
            );
        }

        if (filterValues.status) {
            filtered = filtered.filter(user => user.status === filterValues.status);
        }

        if (filterValues.role) {
            filtered = filtered.filter(user => user.roles?.includes(filterValues.role));
        }

        return filtered;
    }, [allUsers]);

    const filteredUsers = useMemo(() => {
        return applyFilters({});
    }, [allUsers, applyFilters]);

    const create = useCallback(async (data: any) => {
        try {
            const result = await createUser(data).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Usuario creado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al crear usuario:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al crear el usuario';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [createUser, refetch]);

    const update = useCallback(async (id: number, data: any) => {
        try {
            const result = await updateUser({ id, data }).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Usuario actualizado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true, data: result };
        } catch (error: any) {
            console.error('Error al actualizar usuario:', error);
            const message = error?.data?.message || error?.data?.errors || 'Error al actualizar el usuario';
            addToast({
                title: 'Error',
                description: typeof message === 'string' ? message : JSON.stringify(message),
                color: 'danger',
            });
            return { success: false };
        }
    }, [updateUser, refetch]);

    const remove = useCallback(async (id: number) => {
        try {
            await deleteUser(id).unwrap();
            addToast({
                title: 'Éxito',
                description: 'Usuario eliminado exitosamente',
                color: 'success',
            });
            await refetch();
            return { success: true };
        } catch (error: any) {
            console.error('Error al eliminar usuario:', error);
            addToast({
                title: 'Error',
                description: error?.data?.message || 'Error al eliminar el usuario',
                color: 'danger',
            });
            return { success: false };
        }
    }, [deleteUser, refetch]);

    const getUserById = useCallback(async (id: number) => {
        try {
            setSelectedUserId(id);
            const result = await refetchUser();
            if (result.data) {
                return result.data;
            }
            return null;
        } catch (error) {
            console.error('❌ Error al obtener usuario:', error);
            return null;
        }
    }, [refetchUser]);

    return {
        users: allUsers,
        allUsers, 
        pagination,
        isLoading,
        error,
        filters,
        setFilters,
        create,
        update,
        remove,
        getUserById,
        refetch,
        applyFilters,
        filteredUsers,
        getTechnicianOptions, 
    };
}