import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface ConfigAlert {
    id: number;
    name: string;
    description?: string;
    type: 'TEMPERATURE' | 'HUMIDITY' | 'PRESSURE' | 'BATTERY' | 'CUSTOM';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    condition: string;
    threshold: number;
    enabled: boolean;
    createdAt: string;
    updatedAt: string;
    notificationsInternal: NotificationInternal[];
    notificationsExternal: NotificationExternal[];
    devices: Device[];
}

export interface NotificationInternal {
    id: number;
    userId: number;
    userName: string;
    userEmail: string;
    notificationType: 'EMAIL' | 'SMS' | 'PUSH';
}

export interface NotificationExternal {
    id: number;
    name: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    bodyTemplate?: string;
}

export interface Device {
    id: number;
    serialNumber: string;
    name: string;
    type: string;
}

// ==================== REQUEST TYPES ====================

export interface CreateConfigAlertRequest {
    name: string;
    description?: string;
    type: 'TEMPERATURE' | 'HUMIDITY' | 'PRESSURE' | 'BATTERY' | 'CUSTOM';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    condition: string;
    threshold: number;
    enabled?: boolean;
}

export interface UpdateConfigAlertRequest {
    name?: string;
    description?: string;
    type?: 'TEMPERATURE' | 'HUMIDITY' | 'PRESSURE' | 'BATTERY' | 'CUSTOM';
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    condition?: string;
    threshold?: number;
    enabled?: boolean;
}

export interface ConfigAlertFilters {
    name?: string;
    type?: string;
    severity?: string;
    enabled?: boolean;
    page?: number;
    size?: number;
}

export interface AddInternalNotificationRequest {
    userId: number;
    notificationType: 'EMAIL' | 'SMS' | 'PUSH';
}

export interface AddExternalNotificationRequest {
    name: string;
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    bodyTemplate?: string;
}

export interface AddDevicesRequest {
    deviceIds: number[];
}

// ==================== RESPONSE TYPES ====================

export interface ConfigAlertResponse {
    content: ConfigAlert[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface TestAlertResponse {
    success: boolean;
    message: string;
    details?: any;
}

// ==================== API ====================

export const alertsConfigApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // ==================== CRUD PRINCIPAL ====================
        
        // GET /mds/api/v1/config-alerts - Listar configuraciones con filtros
        getConfigAlerts: builder.query<ConfigAlertResponse, ConfigAlertFilters>({
            query: (filters) => {
                const params = new URLSearchParams();
                if (filters.name) params.append('name', filters.name);
                if (filters.type) params.append('type', filters.type);
                if (filters.severity) params.append('severity', filters.severity);
                if (filters.enabled !== undefined) params.append('enabled', filters.enabled.toString());
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mds/api/v1/config-alerts${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['ConfigAlerts'],
        }),

        // GET /mds/api/v1/config-alerts/{id} - Obtener configuración por ID
        getConfigAlertById: builder.query<ConfigAlert, number>({
            query: (id) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'ConfigAlert', id }],
        }),

        // POST /mds/api/v1/config-alerts - Crear configuración de alerta
        createConfigAlert: builder.mutation<ConfigAlert, CreateConfigAlertRequest>({
            query: (data) => ({
                url: `${API}/mds/api/v1/config-alerts`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ConfigAlerts'],
        }),

        // PUT /mds/api/v1/config-alerts/{id} - Actualizar configuración de alerta
        updateConfigAlert: builder.mutation<ConfigAlert, { id: number; data: UpdateConfigAlertRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'ConfigAlerts',
                { type: 'ConfigAlert', id }
            ],
        }),

        // DELETE /mds/api/v1/config-alerts/{id} - Eliminar configuración de alerta
        deleteConfigAlert: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ConfigAlerts'],
        }),

        // ==================== NOTIFICACIONES INTERNAS ====================

        // POST /mds/api/v1/config-alerts/{id}/notifications-internal - Agregar notificaciones internas
        addInternalNotifications: builder.mutation<ConfigAlert, { id: number; data: AddInternalNotificationRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}/notifications-internal`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'ConfigAlert', id },
                'ConfigAlerts'
            ],
        }),

        // DELETE /mds/api/v1/config-alerts/{id}/notifications-internal - Remover notificaciones internas
        removeInternalNotification: builder.mutation<ConfigAlert, { id: number; notificationId: number }>({
            query: ({ id, notificationId }) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}/notifications-internal`,
                method: 'DELETE',
                body: { notificationId },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'ConfigAlert', id },
                'ConfigAlerts'
            ],
        }),

        // ==================== NOTIFICACIONES EXTERNAS ====================

        // POST /mds/api/v1/config-alerts/{id}/notifications-external - Agregar notificaciones externas
        addExternalNotifications: builder.mutation<ConfigAlert, { id: number; data: AddExternalNotificationRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}/notifications-external`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'ConfigAlert', id },
                'ConfigAlerts'
            ],
        }),

        // DELETE /mds/api/v1/config-alerts/{id}/notifications-external - Remover notificaciones externas
        removeExternalNotification: builder.mutation<ConfigAlert, { id: number; notificationId: number }>({
            query: ({ id, notificationId }) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}/notifications-external`,
                method: 'DELETE',
                body: { notificationId },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'ConfigAlert', id },
                'ConfigAlerts'
            ],
        }),

        addDevicesToAlert: builder.mutation<ConfigAlert, { id: number; data: AddDevicesRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}/devices/add`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'ConfigAlert', id },
                'ConfigAlerts'
            ],
        }),

        removeDevicesFromAlert: builder.mutation<ConfigAlert, { id: number; deviceIds: number[] }>({
            query: ({ id, deviceIds }) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}/devices/remove`,
                method: 'DELETE',
                body: { deviceIds },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'ConfigAlert', id },
                'ConfigAlerts'
            ],
        }),
        testConfigAlert: builder.mutation<TestAlertResponse, number>({
            query: (id) => ({
                url: `${API}/mds/api/v1/config-alerts/${id}/test`,
                method: 'POST',
            }),
        }),
    }),
    overrideExisting: false,
});


export const {
    useGetConfigAlertsQuery,
    useGetConfigAlertByIdQuery,
    useLazyGetConfigAlertsQuery,
    useLazyGetConfigAlertByIdQuery,

    useCreateConfigAlertMutation,
    useUpdateConfigAlertMutation,
    useDeleteConfigAlertMutation,

    useAddInternalNotificationsMutation,
    useRemoveInternalNotificationMutation,

    useAddExternalNotificationsMutation,
    useRemoveExternalNotificationMutation,

    useAddDevicesToAlertMutation,
    useRemoveDevicesFromAlertMutation,

    useTestConfigAlertMutation,
} = alertsConfigApi;