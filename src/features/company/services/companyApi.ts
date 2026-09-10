import { apiSlice } from "../../../app/apiSlice";
import { API } from "../../../config/env";

export interface Company {
    id: number;
    bannerUrl?: string;
    uuid: string;
    name: string;
    tenantAccess?: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    website?: string;
    description?: string;
    taxIdentifierType?: 'RUC' | 'DNI' | 'CE' | string;
    phones: string[];
    emails: string[];
    parentName?: string;
    maxTenantsCreated?: number;
    taxIdentifierValue?: string;
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | string;
    created: string;
    updated: string;
    maxDevicesCreated?: number;
    maxUsersCreated?: number;
    maxDriversCreated?: number;
}

export interface CompanyResponse {
    content: Company[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface CompanyFilters {
    name?: string;
    tenantAccess?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface CreateCompanyRequest {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    bannerUrl?: string;
    taxIdentifierType?: string;
    taxIdentifierValue?: string;
    phones?: string[];
    emails?: string[];
    maxTenantsCreated?: number;
    maxDevicesCreated?: number;
    maxUsersCreated?: number;
    maxDriversCreated?: number;
    tenantAccess?:string;
}

export interface UpdateCompanyRequest {
    name?: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    bannerUrl?: string;
    taxIdentifierType?: string;
    taxIdentifierValue?: string;
    phones?: string[];
    emails?: string[];
    maxTenantsCreated?: number;
    maxDevicesCreated?: number;
    maxUsersCreated?: number;
    maxDriversCreated?: number;
    tenantAccess?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

export const companyApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompanies: builder.query<CompanyResponse, CompanyFilters>({
            query: (filters) => {
                const params = new URLSearchParams();

                if (filters.name) params.append('name', filters.name);
                if (filters.tenantAccess) params.append('tenantAccess', filters.tenantAccess);
                if (filters.status) params.append('status', filters.status);
                if (filters.page !== undefined) params.append('page', filters.page.toString());
                if (filters.size !== undefined) params.append('size', filters.size.toString());

                const queryString = params.toString();
                return {
                    url: `${API}/mah/api/v1/company${queryString ? `?${queryString}` : ''}`,
                    method: 'GET',
                };
            },
            providesTags: ['Companies'],
        }),

        getCompanyById: builder.query<Company, number>({
            query: (id) => ({
                url: `${API}/mah/api/v1/company/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, id) => [{ type: 'Company', id }],
        }),
        createCompany: builder.mutation<Company, CreateCompanyRequest>({
            query: (data) => ({
                url: `${API}/mah/api/v1/company`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Companies'],
        }),

        updateCompany: builder.mutation<Company, { id: number; data: UpdateCompanyRequest }>({
            query: ({ id, data }) => ({
                url: `${API}/mah/api/v1/company/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                'Companies',
                { type: 'Company', id }
            ],
        }),

        deleteCompany: builder.mutation<void, number>({
            query: (id) => ({
                url: `${API}/mah/api/v1/company/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Companies'],
        }),

        addCompanyAccess: builder.mutation<void, { companyId: number; userId: number }>({
            query: ({ companyId, userId }) => ({
                url: `${API}/mah/api/v1/company/${companyId}/add-access/${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Companies'],
        }),

        removeCompanyAccess: builder.mutation<void, { companyId: number; userId: number }>({
            query: ({ companyId, userId }) => ({
                url: `${API}/mah/api/v1/company/${companyId}/remove-access/${userId}`,
                method: 'POST',
            }),
            invalidatesTags: ['Companies'],
        }),

        searchCompanyByAccessName: builder.query<Company[], string>({
            query: (accessName) => ({
                url: `${API}/mah/api/v1/company/search/${encodeURIComponent(accessName)}`,
                method: 'GET',
            }),
            providesTags: ['Companies'],
        }),

        getMyCompany: builder.query<Company, void>({
            query: () => ({
                url: `${API}/mah/api/v1/company/me`,
                method: 'GET',
            }),
            providesTags: ['MyCompany'],
        }),

        getAvailableCompaniesForSwitch: builder.query<Company[], void>({
            query: () => ({
                url: `${API}/mah/api/v1/company/available-for-switch`,
                method: 'GET',
            }),
            providesTags: ['AvailableCompanies'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetCompaniesQuery,
    useGetCompanyByIdQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
    useAddCompanyAccessMutation,
    useRemoveCompanyAccessMutation,
    useSearchCompanyByAccessNameQuery,
    useLazySearchCompanyByAccessNameQuery,
    useGetMyCompanyQuery,
    useLazyGetMyCompanyQuery,
    useGetAvailableCompaniesForSwitchQuery,
    useLazyGetAvailableCompaniesForSwitchQuery,
    useLazyGetCompaniesQuery,
    useLazyGetCompanyByIdQuery,
} = companyApi;