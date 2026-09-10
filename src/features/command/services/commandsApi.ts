import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface Command {
    id: number;
    waterMeterId: number;
    type: string;
    payload: Record<string, any>;
    status: 'PENDING' | 'SENT' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
    retryCount: number;
    createdAt?: string;
    updatedAt?: string;
    executedAt?: string;
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
    errorMessage?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface CommandResponse {
    content: Command[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface CommandFilters {
    status?: string;
    from?: string;
    to?: string;
    page?: number;
    size?: number;
}

export interface CreateCommandRequest {
    waterMeterId: number;
    type: string;
    payload: Record<string, any>;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface UpdateCommandStatusRequest {
    status: 'PENDING' | 'SENT' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
    errorMessage?: string;
}

export const commandsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCommands: builder.query<CommandResponse, CommandFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.status) params.append('status', filters.status);
                if (filters.from) params.append('from', filters.from);
                if (filters.to) params.append('to', filters.to);

                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mms/api/v1/commands${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Commands'],
        }),

        getCommandById: builder.query<Command, number>({
            query: (id) => ({
                url: `${API}/mms/api/v1/commands/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Command', id }],
        }),

        createCommand: builder.mutation<Command, CreateCommandRequest>({
            query: (data) => ({
                url: `${API}/mms/api/v1/commands`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Commands'],
        }),

        updateCommandStatus: builder.mutation<Command, { id: number; data: UpdateCommandStatusRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mms/api/v1/commands/${id}/status`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'Commands',
                { type: 'Command', id }
            ],
        }),

        getCommandsByWaterMeter: builder.query<Command[], number>({
            query: (waterMeterId) => ({
                url: `${API}/mms/api/v1/commands/water-meter/${waterMeterId}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, waterMeterId) => [{ type: 'Command', id: `meter-${waterMeterId}` }],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCommandsQuery,
    useGetCommandByIdQuery,
    useCreateCommandMutation,
    useUpdateCommandStatusMutation,
    useGetCommandsByWaterMeterQuery,
    useLazyGetCommandsQuery,
    useLazyGetCommandByIdQuery,
    useLazyGetCommandsByWaterMeterQuery,
} = commandsApi;