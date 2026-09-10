import { apiSlice } from "../../../app/apiSlice";

export interface Attachment {
    id: number;
    filename: string;
    fileUrl: string;
    fileType: string;
    description: string;
    created: string;
    updated?: string;
}

export interface AttachmentResponse {
    content: Attachment[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface AttachmentFilters {
    search?: string;
    fileType?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export const attachmentApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAttachments: builder.query<AttachmentResponse, AttachmentFilters>({
            query: (filters) => {
                const params = new URLSearchParams();
                if (filters?.search) params.append('search', filters.search);
                if (filters?.fileType) params.append('fileType', filters.fileType);
                if (filters?.page !== undefined) params.append('page', String(filters.page));
                if (filters?.size) params.append('size', String(filters.size));
                if (filters?.sortBy) params.append('sortBy', filters.sortBy);
                if (filters?.sortDir) params.append('sortDir', filters.sortDir);
                
                return {
                    url: `/shs/api/v1/attachment?${params.toString()}`,
                };
            },
            providesTags: ['Attachments'],
        }),
        getAttachmentById: builder.query<Attachment, number>({
            query: (id) => ({
                url: `/shs/api/v1/attachment/${id}`,
            }),
            providesTags: (_result, _error, id) => [{ type: 'Attachments', id }],
        }),
        createAttachment: builder.mutation<Attachment, Partial<Attachment>>({
            query: (body) => ({
                url: `/shs/api/v1/attachment`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Attachments'],
        }),
        updateAttachment: builder.mutation<Attachment, { id: number; data: Partial<Attachment> }>({
            query: ({ id, data }) => ({
                url: `/shs/api/v1/attachment/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Attachments', id }],
        }),
        deleteAttachment: builder.mutation<void, number>({
            query: (id) => ({
                url: `/shs/api/v1/attachment/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Attachments'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAttachmentsQuery,
    useGetAttachmentByIdQuery,
    useCreateAttachmentMutation,
    useUpdateAttachmentMutation,
    useDeleteAttachmentMutation,
} = attachmentApi;