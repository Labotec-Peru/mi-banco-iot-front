// components/ModalCompanySelector.tsx
import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getCompanyFormFields,
    getCompanyFormGroups,
    getCompanyInitialValues,
    mapCompanyToFormValues,
} from "@/features/company/components/CompanyFormFields";
import type { Company } from "../types/company";

interface ModalCompanySelectorProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    company?: Company | null;
    mode?: 'create' | 'edit' | 'view';
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    title?: string;
    submitLabel?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
    readonly?: boolean;
}

export default function ModalCompanySelector({
    isOpen,
    onOpenChange,
    company = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
    title,
    submitLabel,
    size = "2xl",
    readonly = false,
}: ModalCompanySelectorProps) {
    const [initialValues, setInitialValues] = useState(getCompanyInitialValues());

    useEffect(() => {
        if (company && (mode === 'edit' || mode === 'view')) {
            setInitialValues(mapCompanyToFormValues(company));
        } else {
            setInitialValues(getCompanyInitialValues());
        }
    }, [company, mode]);

    const modalTitle = title || (mode === 'create' ? 'Nueva Empresa' : mode === 'view' ? 'Ver Empresa' : 'Editar Empresa');
    const modalSubmitLabel = submitLabel || (mode === 'create' ? 'Crear' : 'Actualizar');

    const handleSubmit = async (formData: Record<string, any>) => {
        if (mode === 'view') return;
        
        const dataToSubmit = {
            ...formData,
            tenantAccess: formData.tenantAccess || 
                         formData.name?.toLowerCase().replace(/\s+/g, '-') || 
                         `tenant-${Date.now()}`,
            phones: formData.phones ? formData.phones.split(',').map((p: string) => p.trim()).filter(Boolean) : [],
            emails: formData.emails ? formData.emails.split(',').map((e: string) => e.trim()).filter(Boolean) : [],
            maxTenantsCreated: formData.maxTenantsCreated ? Number(formData.maxTenantsCreated) : undefined,
            maxDevicesCreated: formData.maxDevicesCreated ? Number(formData.maxDevicesCreated) : undefined,
            maxUsersCreated: formData.maxUsersCreated ? Number(formData.maxUsersCreated) : undefined,
            maxDriversCreated: formData.maxDriversCreated ? Number(formData.maxDriversCreated) : undefined,
        };
        
        await onSubmit(dataToSubmit);
    };

    const fields = getCompanyFormFields();
    
    const readonlyFields = readonly || mode === 'view' 
        ? fields.map(field => ({ ...field, disabled: true, readOnly: true }))
        : fields;

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={modalTitle}
            fields={readonlyFields}
            groups={getCompanyFormGroups()}
            size={size}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={modalSubmitLabel}
            cancelLabel={mode === 'view' ? 'Cerrar' : 'Cancelar'}
            isLoading={isLoading}
        />
    );
}