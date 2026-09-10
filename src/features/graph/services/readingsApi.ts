import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface ApiReading {
    id: number;
    waterMeterId: number;
    title: string;
    obisCode: string;
    readingAt: string;
    sourceIp: string | null;
    values: Array<{
        id: number;
        attributeName: string;
        value: string;
        recordedAt: string;
    }>;
}

export interface ReadingResponse {
    content: ApiReading[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface ReadingFilters {
    waterMeterId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    search?: string;
    page?: number;
    size?: number;
}

export interface Reading {
    id: number;
    waterMeterId: number;
    value: number;
    readingDate: string;
    consumption?: number;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    waterMeter?: {
        id: number;
        serialNumber: string;
        meterModel?: {
            id: number;
            name: string;
        };
        meterBrand?: {
            id: number;
            name: string;
        };
    };
}

export interface ReadingFilters {
    waterMeterId?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    search?: string;
    page?: number;
    size?: number;
}
export interface CreateReadingRequest {
    waterMeterId: number;
    value: number;
    readingDate: string;
}

export const readingsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReadings: builder.query<ReadingResponse, ReadingFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.waterMeterId) params.append('waterMeterId', filters.waterMeterId.toString());
                if (filters.startDate) params.append('from', filters.startDate);
                if (filters.endDate) params.append('to', filters.endDate);
                if (filters.status) params.append('status', filters.status);
                if (filters.search) params.append('search', filters.search);
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/readings${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Readings'],
        }),

        getAllReadings: builder.query<ReadingResponse, ReadingFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.waterMeterId) params.append('waterMeterId', filters.waterMeterId.toString());
                if (filters.startDate) params.append('from', filters.startDate);
                if (filters.endDate) params.append('to', filters.endDate);
                if (filters.status) params.append('status', filters.status);
                params.append('size', '1000'); 

                return {
                    url: `${API}/mms/api/v1/readings?${params.toString()}`,
                    method: 'GET',
                };
            },
            providesTags: ['Readings'],
        }),

        getReadingById: builder.query<Reading, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/readings/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Reading', id }],
        }),

        createReading: builder.mutation<Reading, CreateReadingRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/readings`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Readings'],
        }),

        getLastReading: builder.query<Reading, number>({
            query: (waterMeterId) => ({
                url: `${API}/mms/api/v1/readings/water-meter/${waterMeterId}/last`,
                method: 'GET',
            }),
            providesTags: (_result, _error, waterMeterId) => [{ type: 'Reading', id: `last-${waterMeterId}` }],
        }),

        getMyReadingsByWaterMeter: builder.query<Reading[], number>({
            query: (waterMeterId) => ({
                url: `${API}/mms/api/v1/readings/me/water-meter/${waterMeterId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, waterMeterId) => [{ type: 'Reading', id: `me-${waterMeterId}` }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetReadingsQuery,
    useGetAllReadingsQuery,
    useGetReadingByIdQuery,
    useCreateReadingMutation,
    useGetLastReadingQuery,
    useGetMyReadingsByWaterMeterQuery,
    useLazyGetReadingsQuery,
    useLazyGetReadingByIdQuery,
    useLazyGetLastReadingQuery,
    useLazyGetMyReadingsByWaterMeterQuery,
} = readingsApi;