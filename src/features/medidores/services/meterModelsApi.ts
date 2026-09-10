import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface MeterModel {
    id: number;
    name: string;
    description?: string;
    meterBrandId: number;
    meterBrandName?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MeterModelResponse {
    content: MeterModel[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface MeterModelFilters {
    name?: string;
    meterBrandId?: number;
    page?: number;
    size?: number;
}

export interface CreateMeterModelRequest {
    name: string;
    description?: string;
    meterBrandId: number;
}

export interface UpdateMeterModelRequest {
    name?: string;
    description?: string;
    meterBrandId?: number;
}

export const meterModelsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMeterModels: builder.query<MeterModelResponse, MeterModelFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.name) params.append('name', filters.name);
                if (filters.meterBrandId) params.append('meterBrandId', filters.meterBrandId.toString());
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/meter-models${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['MeterModels'],
        }),

        getMeterModelById: builder.query<MeterModel, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/meter-models/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'MeterModel', id }],
        }),

        createMeterModel: builder.mutation<MeterModel, CreateMeterModelRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/meter-models`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['MeterModels'],
        }),

        updateMeterModel: builder.mutation<MeterModel, { id: number; data: UpdateMeterModelRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mms/api/v1/meter-models/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'MeterModels',
                { type: 'MeterModel', id }
            ],
        }),

        deleteMeterModel: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/meter-models/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MeterModels'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMeterModelsQuery,
    useGetMeterModelByIdQuery,
    useCreateMeterModelMutation,
    useUpdateMeterModelMutation,
    useDeleteMeterModelMutation,
    useLazyGetMeterModelsQuery,
    useLazyGetMeterModelByIdQuery,
} = meterModelsApi;