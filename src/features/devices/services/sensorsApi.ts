import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface Sensor {
    id: number;
    serialNumber: string;
    meterBrandId: number;
    meterModelId: number;
    firmwareVersion?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    meterBrand?: {
        id: number;
        name: string;
    };
    meterModel?: {
        id: number;
        name: string;
    };
}

export interface SensorResponse {
    content: Sensor[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface SensorFilters {
    serialNumber?: string;
    meterBrandId?: number;
    meterModelId?: number;
    status?: string;
    page?: number;
    size?: number;
}

export interface CreateSensorRequest {
    serialNumber: string;
    meterBrandId: number;
    meterModelId: number;
    firmwareVersion?: string;
    imei?: string;
    devicePassword?: string;
}

export interface UpdateSensorRequest {
    serialNumber?: string;
    meterBrandId?: number;
    meterModelId?: number;
    firmwareVersion?: string;
}

export interface SensorInstallation {
    id: number;
    sensorId: number;
    waterMeterId: number;
    technicianId: number;
    installedAt: string;
    removedAt?: string;
    status: 'ACTIVE' | 'REMOVED';
    notes?: string;
    sensor?: Sensor;
    waterMeter?: {
        id: number;
        serialNumber: string;
    };
    technician?: {
        id: number;
        name: string;
    };
}

export interface SensorInstallationHistory {
    id: number;
    sensorId: number;
    waterMeterId: number;
    technicianId: number;
    installedAt: string;
    removedAt?: string;
    status: 'ACTIVE' | 'REMOVED';
    notes?: string;
    installedBy?: string;
    removedBy?: string;
}

export interface CreateSensorInstallationRequest {
    sensorId: number;
    waterMeterId: number;
    technicianId: number;
    notes?: string;
}

export interface SensorInstallationFilters {
    waterMeterId?: number;
    technicianId?: number;
    sensorId?: number;
    status?: 'ACTIVE' | 'REMOVED';
    page?: number;
    size?: number;
}

export interface SensorInstallationResponse {
    content: SensorInstallation[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}


export const sensorsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSensors: builder.query<SensorResponse, SensorFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.serialNumber) params.append('serialNumber', filters.serialNumber);
                if (filters.meterBrandId) params.append('meterBrandId', filters.meterBrandId.toString());
                if (filters.meterModelId) params.append('meterModelId', filters.meterModelId.toString());
                if (filters.status) params.append('status', filters.status);
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/sensors${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Sensors'],
        }),

        getSensorById: builder.query<Sensor, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/sensors/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Sensor', id }],
        }),

        createSensor: builder.mutation<Sensor, CreateSensorRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/sensors`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Sensors'],
        }),

        updateSensor: builder.mutation<Sensor, { id: number; data: UpdateSensorRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mms/api/v1/sensors/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'Sensors',
                { type: 'Sensor', id }
            ],
        }),
        createSensorInstallation: builder.mutation<SensorInstallation, CreateSensorInstallationRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/sensor-installations`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['SensorInstallations', 'SensorInstallationsHistory'],
        }),

        removeSensorInstallationByWaterMeter: builder.mutation<void, { waterMeterId: number; notes?: string }>({
            query: ({ waterMeterId, notes }) => ({
                url: `${API}/mms/api/v1/sensor-installations/water-meter/${waterMeterId}/remove`,
                method: 'PATCH',
                body: notes ? { notes } : undefined,
            }),
            invalidatesTags: (_result, _error, { waterMeterId }) => [
                'SensorInstallations',
                'SensorInstallationsHistory',
                { type: 'WaterMeterInstallation', id: waterMeterId }
            ],
        }),

        getSensorInstallationsByWaterMeterHistory: builder.query<SensorInstallationHistory[], number>({
            query: (waterMeterId) => ({
                url: `${API}/mms/api/v1/sensor-installations/water-meter/${waterMeterId}/history`,
                method: 'GET',
            }),
            providesTags: (_result, _error, waterMeterId) => [
                { type: 'WaterMeterInstallationHistory', id: waterMeterId }
            ],
        }),

        getCurrentSensorInstallationByWaterMeter: builder.query<SensorInstallation, number>({
            query: (waterMeterId) => ({
                url: `${API}/mms/api/v1/sensor-installations/water-meter/${waterMeterId}/current`,
                method: 'GET',
            }),
            providesTags: (_result, _error, waterMeterId) => [
                { type: 'WaterMeterInstallation', id: waterMeterId }
            ],
        }),

        getSensorInstallationsByTechnician: builder.query<SensorInstallationResponse, { technicianId: number; filters?: Omit<SensorInstallationFilters, 'technicianId'> }>({
            query: ({ technicianId, filters }) => {
                const params = new URLSearchParams();

                if (filters?.status) params.append('status', filters.status);
                if (filters?.page !== undefined) params.append('page', filters.page.toString());
                if (filters?.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/sensor-installations/technician/${technicianId}${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['SensorInstallations'],
        }),

        getSensorInstallationHistoryBySensor: builder.query<SensorInstallationHistory[], number>({
            query: (sensorId) => ({
                url: `${API}/mms/api/v1/sensor-installations/sensor/${sensorId}/history`,
                method: 'GET',
            }),
            providesTags: (_result, _error, sensorId) => [
                { type: 'SensorInstallationHistory', id: sensorId }
            ],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetSensorsQuery,
    useGetSensorByIdQuery,
    useCreateSensorMutation,
    useUpdateSensorMutation,
    useLazyGetSensorsQuery,
    useLazyGetSensorByIdQuery,
    useCreateSensorInstallationMutation,
    useRemoveSensorInstallationByWaterMeterMutation,
    useGetSensorInstallationsByWaterMeterHistoryQuery,
    useGetCurrentSensorInstallationByWaterMeterQuery,
    useGetSensorInstallationsByTechnicianQuery,
    useGetSensorInstallationHistoryBySensorQuery,
    useLazyGetSensorInstallationsByWaterMeterHistoryQuery,
    useLazyGetCurrentSensorInstallationByWaterMeterQuery,
    useLazyGetSensorInstallationsByTechnicianQuery,
    useLazyGetSensorInstallationHistoryBySensorQuery,
} = sensorsApi;