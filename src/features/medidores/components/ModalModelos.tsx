import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getModeloFormFields,
    getModeloFormGroups,
    getModeloInitialValues,
    mapModeloToFormValues,
    type SelectOption,
} from "./ModeloFormFields";
import type { Modelo } from "../types/modelo";

interface ModalModelosProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    modelo?: Modelo | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: { name: string; description?: string; meterBrandId?: number }) => Promise<void>;
    isLoading?: boolean;
    brands?: SelectOption[];
    isLoadingBrands?: boolean;
}

export default function ModalModelos({
    isOpen,
    onOpenChange,
    modelo = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
    brands = [],
    isLoadingBrands = false,
}: ModalModelosProps) {
    const [initialValues, setInitialValues] = useState(getModeloInitialValues());

    useEffect(() => {
        if (modelo && mode === 'edit') {
            const mapped = mapModeloToFormValues(modelo);
            setInitialValues(mapped);
        } else {
            setInitialValues(getModeloInitialValues());
        }
    }, [modelo, mode]);

    const title = mode === 'create' ? 'Nuevo Modelo' : 'Editar Modelo';
    const submitLabel = mode === 'create' ? 'Crear' : 'Actualizar';

    const fields = getModeloFormFields(brands);

    const handleSubmit = async (formData: Record<string, any>) => {

        let meterBrandId: number | undefined;
        
        if (formData.meterBrandId) {
            const parsed = Number(formData.meterBrandId);
            if (!isNaN(parsed) && parsed > 0) {
                meterBrandId = parsed;
            }
        }

        if (!meterBrandId && modelo?.meterBrandId) {
            meterBrandId = Number(modelo.meterBrandId);
        }

        const data = {
            name: formData.name,
            description: formData.description || undefined,
            meterBrandId: meterBrandId,
        };

        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getModeloFormGroups()}
            size="lg"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading || isLoadingBrands}
        />
    );
}