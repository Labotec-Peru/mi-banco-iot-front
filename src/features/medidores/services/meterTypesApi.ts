import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";
export interface MeterType {
    id: number;
    name: string;
    abbreviation?: string;  
    description?: string;
    code?: string;
    createdAt?: string;
    updatedAt?: string;
    status?: string;
}

export interface MeterTypeResponse {
    content: MeterType[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface MeterTypeFilters {
    name?: string;
    abbreviation?: string;  
    code?: string;
    page?: number;
    size?: number;
}

export interface CreateMeterTypeRequest {
    name: string;
    abbreviation?: string;  
}

export interface UpdateMeterTypeRequest {
    name?: string;
    abbreviation?: string;  
}

export const meterTypesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMeterTypes: builder.query<MeterTypeResponse, MeterTypeFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.name) params.append('name', filters.name);
                if (filters.abbreviation) params.append('abbreviation', filters.abbreviation);
                if (filters.code) params.append('code', filters.code);
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/meter-types${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['MeterTypes'],
        }),

        getMeterTypeById: builder.query<MeterType, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/meter-types/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'MeterType', id }],
        }),

        createMeterType: builder.mutation<MeterType, CreateMeterTypeRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/meter-types`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['MeterTypes'],
        }),

        updateMeterType: builder.mutation<MeterType, { id: number; data: UpdateMeterTypeRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mms/api/v1/meter-types/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'MeterTypes',
                { type: 'MeterType', id }
            ],
        }),

        deleteMeterType: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/meter-types/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MeterTypes'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMeterTypesQuery,
    useGetMeterTypeByIdQuery,
    useCreateMeterTypeMutation,
    useUpdateMeterTypeMutation,
    useDeleteMeterTypeMutation,
    useLazyGetMeterTypesQuery,
    useLazyGetMeterTypeByIdQuery,
} = meterTypesApi;