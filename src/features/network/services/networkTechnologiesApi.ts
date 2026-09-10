import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface NetworkTechnology {
    id: number;
    name: string;
    abbreviation?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface NetworkTechnologyResponse {
    content: NetworkTechnology[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface NetworkTechnologyFilters {
    name?: string;
    abbreviation?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface CreateNetworkTechnologyRequest {
    name: string;
    abbreviation?: string;
}

export interface UpdateNetworkTechnologyRequest {
    name?: string;
    abbreviation?: string;
}

export const networkTechnologiesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getNetworkTechnologies: builder.query<NetworkTechnologyResponse, NetworkTechnologyFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.name) params.append('name', filters.name);
                if (filters.abbreviation) params.append('abbreviation', filters.abbreviation);
                if (filters.status) params.append('status', filters.status);
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/network-technologies${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['NetworkTechnologies'],
        }),

        getNetworkTechnologyById: builder.query<NetworkTechnology, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/network-technologies/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'NetworkTechnology', id }],
        }),

        createNetworkTechnology: builder.mutation<NetworkTechnology, CreateNetworkTechnologyRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/network-technologies`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['NetworkTechnologies'],
        }),

        updateNetworkTechnology: builder.mutation<NetworkTechnology, { id: number; data: UpdateNetworkTechnologyRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mms/api/v1/network-technologies/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'NetworkTechnologies',
                { type: 'NetworkTechnology', id }
            ],
        }),

        deleteNetworkTechnology: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/network-technologies/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['NetworkTechnologies'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetNetworkTechnologiesQuery,
    useGetNetworkTechnologyByIdQuery,
    useCreateNetworkTechnologyMutation,
    useUpdateNetworkTechnologyMutation,
    useDeleteNetworkTechnologyMutation,
    useLazyGetNetworkTechnologiesQuery,
    useLazyGetNetworkTechnologyByIdQuery,
} = networkTechnologiesApi;