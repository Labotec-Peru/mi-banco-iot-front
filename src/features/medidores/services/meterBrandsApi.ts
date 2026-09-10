import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface MeterBrand {
    status: string;
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    manufacturerCompanyId: number;
    estado:string;
}

export interface MeterBrandResponse {
    content: MeterBrand[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface MeterBrandFilters {
    name?: string;
    page?: number;
    size?: number;
}

export interface CreateMeterBrandRequest {
    name: string;
    description?: string;
    manufacturerCompanyId?: number
    
}

export interface UpdateMeterBrandRequest {
    name?: string;
    description?: string;
    manufacturerCompanyId?: number
}

export const meterBrandsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMeterBrands: builder.query<MeterBrandResponse, MeterBrandFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.name) params.append('name', filters.name);
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/meter-brands${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['MeterBrands'],
        }),

        getMeterBrandById: builder.query<MeterBrand, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/meter-brands/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'MeterBrand', id }],
        }),

        createMeterBrand: builder.mutation<MeterBrand, CreateMeterBrandRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/meter-brands`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['MeterBrands'],
        }),

        updateMeterBrand: builder.mutation<MeterBrand, { id: number; data: UpdateMeterBrandRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mms/api/v1/meter-brands/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'MeterBrands',
                { type: 'MeterBrand', id }
            ],
        }),

        deleteMeterBrand: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/meter-brands/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MeterBrands'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMeterBrandsQuery,
    useGetMeterBrandByIdQuery,
    useCreateMeterBrandMutation,
    useUpdateMeterBrandMutation,
    useDeleteMeterBrandMutation,
    useLazyGetMeterBrandsQuery,
    useLazyGetMeterBrandByIdQuery,
} = meterBrandsApi;