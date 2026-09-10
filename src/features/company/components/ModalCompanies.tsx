import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getCompanyFormFields,
    getCompanyFormGroups,
    getCompanyInitialValues,
    mapCompanyToFormValues,
} from "./CompanyFormFields";
import type { Company } from "../types/company";

interface ModalCompaniesProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    company?: Company | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export default function ModalCompanies({
    isOpen,
    onOpenChange,
    company = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
}: ModalCompaniesProps) {
    const [initialValues, setInitialValues] = useState(getCompanyInitialValues());

    useEffect(() => {
        if (company && mode === 'edit') {
            setInitialValues(mapCompanyToFormValues(company));
        } else {
            setInitialValues(getCompanyInitialValues());
        }
    }, [company, mode]);

    const title = mode === 'create' ? 'Nueva Empresa' : 'Editar Empresa';
    const submitLabel = mode === 'create' ? 'Crear' : 'Actualizar';

    const handleSubmit = async (formData: Record<string, any>) => {
        await onSubmit(formData);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={getCompanyFormFields()}
            groups={getCompanyFormGroups()}
            size="2xl"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading}
        />
    );
}