import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";
import type {
    WaterMeter,
    WaterMeterResponse,
    WaterMeterFilters,
    CreateWaterMeterRequest,
    UpdateWaterMeterRequest
} from "../types/waterMeter.types";

export const waterMeterApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getWaterMeters: builder.query<WaterMeterResponse, WaterMeterFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.serialNumber) params.append('serialNumber', filters.serialNumber);
                if (filters.podCode) params.append('podCode', filters.podCode);
                if (filters.clientCompanyId) params.append('clientCompanyId', filters.clientCompanyId.toString());
                if (filters.providerCompanyId) params.append('providerCompanyId', filters.providerCompanyId.toString());
                if (filters.meterTypeId) params.append('meterTypeId', filters.meterTypeId.toString());
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/water-meters${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['WaterMeters'],
        }),
        getWaterMeterById: builder.query<WaterMeter, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/water-meters/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'WaterMeter', id }],
        }),
        createWaterMeter: builder.mutation<WaterMeter, CreateWaterMeterRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/water-meters`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['WaterMeters', 'MyWaterMeters'],
        }),

        updateWaterMeter: builder.mutation<WaterMeter, { id: number; data: UpdateWaterMeterRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mms/api/v1/water-meters/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'WaterMeters',
                'MyWaterMeters',
                { type: 'WaterMeter', id }
            ],
        }),

        deleteWaterMeter: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/water-meters/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['WaterMeters', 'MyWaterMeters'],
        }),

        getMyWaterMeters: builder.query<WaterMeterResponse, WaterMeterFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.serialNumber) params.append('serialNumber', filters.serialNumber);
                if (filters.podCode) params.append('podCode', filters.podCode);
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/water-meters/me${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['MyWaterMeters'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetWaterMetersQuery,
    useGetWaterMeterByIdQuery,
    useCreateWaterMeterMutation,
    useUpdateWaterMeterMutation,
    useDeleteWaterMeterMutation,
    useGetMyWaterMetersQuery,
    useLazyGetWaterMetersQuery,
    useLazyGetWaterMeterByIdQuery,
    useLazyGetMyWaterMetersQuery,
} = waterMeterApi;