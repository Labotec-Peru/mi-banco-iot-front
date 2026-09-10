export interface Company {
    id: number;
    uuid: string;
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
    website?: string;
    logo?: string;
    bannerUrl?: string;
    taxIdentifierType?: 'RUC' | 'DNI' | 'CE' | string;
    taxIdentifierValue?: string;
    phones: string[];
    emails: string[];
    status: 'ACTIVE' | 'INACTIVE' | 'DELETED' | string;
    created: string;
    updated: string;
    maxTenantsCreated?: number;
    maxDevicesCreated?: number;
    maxUsersCreated?: number;
    maxDriversCreated?: number;
    parentName?: string;
    tenantAccess?: string;
}

export interface CompanyFormValues {
    name: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    bannerUrl: string;
    taxIdentifierType: string;
    taxIdentifierValue: string;
    phones: string;
    emails: string;
    status: string;
    maxTenantsCreated: number;
    maxDevicesCreated: number;
    maxUsersCreated: number;
    maxDriversCreated: number;
    tenantAccess: string;    
}