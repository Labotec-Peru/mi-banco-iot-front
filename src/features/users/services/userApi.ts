import { apiSlice } from "../../../app/apiSlice";
export interface Group {
    id: number;
    name: string;
    description: string;
    created: string;
}
export interface Attachment {
    id: number;
    fileUrl: string;
    fileType: string;
    filename: string;
    description: string;
    created: string;
}
export interface Tag {
    id: number;
    name: string;
    created: string;
}
export interface PreferenceJson {
    [key: string]: any;
}
export interface User {
    id: number;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    systemStatus: string; 
    documentType: string; 
    phone: string;
    phones: string[];
    emails: string[];
    notifications: string[];
    timeZone: string;
    lastIpAddress: string;
    status: string;
    views: string[]; 
    preferenceJson: PreferenceJson;
    groups: Group[];
    attachments: Attachment[];
    tags: Tag[];
    roles: string[]; 
    scopesValues: string[];
    scopes: string[];
    applications: string[]; 
    created: string;
    imageUrl: string;
    updated: string;
}
export interface UserResponse {
    content: User[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface UserFilters {
    search?: string;
    status?: string;
    role?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getUsers: builder.query<UserResponse, void>({
            query: () => ({
                url: `/mah/api/v1/users`,
            }),
        }),
        getUserById: builder.query<User, number>({
            query: (id) => ({
                url: `/mah/api/v1/users/${id}`,
            }),
        }),
        createUser: builder.mutation<User, Partial<User>>({
            query: (body) => ({
                url: `/mah/api/v1/users`,
                method: 'POST',
                body,
            }),
        }),
        updateUser: builder.mutation<User, { id: number; data: Partial<User> }>({
            query: ({ id, data }) => ({
                url: `/mah/api/v1/users/${id}`,
                method: 'PUT',
                body: data,
            }),
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/mah/api/v1/users/${id}`,
                method: 'DELETE',
            }),
        }),
        addUserPermissions: builder.mutation<User, { id: number; permissions: any }>({
            query: ({ id, permissions }) => ({
                url: `/mah/api/v1/users/${id}/permissions`,
                method: 'POST',
                body: permissions,
            }),
        }),
        removeUserPermissions: builder.mutation<void, { id: number; permissions: any }>({
            query: ({ id, permissions }) => ({
                url: `/mah/api/v1/users/${id}/permissions`,
                method: 'DELETE',
                body: permissions,
            }),
        }),
        addUserTags: builder.mutation<User, { id: number; tags: Partial<Tag>[] }>({
            query: ({ id, tags }) => ({
                url: `/mah/api/v1/users/${id}/add/tags`,
                method: 'POST',
                body: tags,
            }),
        }),
        addUserGroups: builder.mutation<User, { id: number; groups: Partial<Group>[] }>({
            query: ({ id, groups }) => ({
                url: `/mah/api/v1/users/${id}/add/groups`,
                method: 'POST',
                body: groups,
            }),
        }),
        addUserExcludeApplications: builder.mutation<User, { id: number; applications: string[] }>({
            query: ({ id, applications }) => ({
                url: `/mah/api/v1/users/${id}/add/exclude-applications`,
                method: 'POST',
                body: applications,
            }),
        }),
        addUserAttachments: builder.mutation<User, { id: number; attachments: Partial<Attachment>[] }>({
            query: ({ id, attachments }) => ({
                url: `/mah/api/v1/users/${id}/add/attachments`,
                method: 'POST',
                body: attachments,
            }),
        }),
        setUserPreferenceJson: builder.mutation<User, { id?: number; preferenceJson: PreferenceJson }>({
            query: ({ preferenceJson }) => ({
                url: `/mah/api/v1/users/preference-json`,
                method: 'POST',
                body: preferenceJson,
            }),
        }),
        getUserTags: builder.query<Tag[], number>({
            query: (id) => ({
                url: `/mah/api/v1/users/${id}/tags`,
            }),
        }),
        getUserGroups: builder.query<Group[], number>({
            query: (id) => ({
                url: `/mah/api/v1/users/${id}/groups`,
            }),
        }),
        getUserAttachments: builder.query<Attachment[], number>({
            query: (id) => ({
                url: `/mah/api/v1/users/${id}/attachments`,
            }),
        }),

        getUserSummaryStatus: builder.query<any, void>({
            query: () => ({
                url: `/mah/api/v1/users/summary-status`,
            }),
        }),

        removeUserTags: builder.mutation<void, { id: number; tags: Partial<Tag>[] }>({
            query: ({ id, tags }) => ({
                url: `/mah/api/v1/users/${id}/remove/tags`,
                method: 'DELETE',
                body: tags,
            }),
        }),

        removeUserGroups: builder.mutation<void, { id: number; groups: Partial<Group>[] }>({
            query: ({ id, groups }) => ({
                url: `/mah/api/v1/users/${id}/remove/groups`,
                method: 'DELETE',
                body: groups,
            }),
        }),

        removeUserExcludeApplications: builder.mutation<void, { id: number; applications: string[] }>({
            query: ({ id, applications }) => ({
                url: `/mah/api/v1/users/${id}/remove/exclude-applications`,
                method: 'DELETE',
                body: applications,
            }),
        }),

        removeUserAttachments: builder.mutation<void, { id: number; attachments: Partial<Attachment>[] }>({
            query: ({ id, attachments }) => ({
                url: `/mah/api/v1/users/${id}/remove/attachments`,
                method: 'DELETE',
                body: attachments,
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useAddUserPermissionsMutation,
    useRemoveUserPermissionsMutation,
    useAddUserTagsMutation,
    useAddUserGroupsMutation,
    useAddUserExcludeApplicationsMutation,
    useAddUserAttachmentsMutation,
    useSetUserPreferenceJsonMutation,
    useGetUserTagsQuery,
    useGetUserGroupsQuery,
    useGetUserAttachmentsQuery,
    useGetUserSummaryStatusQuery,
    useRemoveUserTagsMutation,
    useRemoveUserGroupsMutation,
    useRemoveUserExcludeApplicationsMutation,
    useRemoveUserAttachmentsMutation,
} = userApi;