import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getMarcaFormFields,
    getMarcaFormGroups,
    getMarcaInitialValues,
    mapMarcaToFormValues,
    type SelectOption,
} from "./MarcaFormFields";
import type { Marca } from "../types/marca";

interface ModalMarcasProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    marca?: Marca | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: { name: string; description?: string; manufacturerCompanyId?: number }) => Promise<void>;
    isLoading?: boolean;
    companies?: SelectOption[];
    isLoadingCompanies?: boolean;
}

export default function ModalMarcas({
    isOpen,
    onOpenChange,
    marca = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
    companies = [],
    isLoadingCompanies = false,
}: ModalMarcasProps) {
    const [initialValues, setInitialValues] = useState(getMarcaInitialValues());

    useEffect(() => {
        if (marca && mode === 'edit') {
            setInitialValues(mapMarcaToFormValues(marca));
        } else {
            setInitialValues(getMarcaInitialValues());
        }
    }, [marca, mode]);

    const title = mode === 'create' ? 'Nueva Marca' : 'Editar Marca';
    const submitLabel = mode === 'create' ? 'Crear' : 'Actualizar';

    const fields = getMarcaFormFields(companies);

    const handleSubmit = async (formData: Record<string, any>) => {

        let manufacturerCompanyId: number | undefined;
        
        if (formData.manufacturerCompanyId) {
            const parsed = Number(formData.manufacturerCompanyId);
            if (!isNaN(parsed) && parsed > 0) {
                manufacturerCompanyId = parsed;
            }
        }

        if (!manufacturerCompanyId && marca?.manufacturerCompanyId) {
            manufacturerCompanyId = Number(marca.manufacturerCompanyId);
        }

        const data = {
            name: formData.name,
            description: formData.description || undefined,
            manufacturerCompanyId: manufacturerCompanyId, 
        };

        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getMarcaFormGroups()}
            size="lg"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading || isLoadingCompanies}
        />
    );
}