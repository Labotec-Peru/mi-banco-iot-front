import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getTipoFormFields,
    getTipoFormGroups,
    getTipoInitialValues,
    mapTipoToFormValues,
} from "./TipoFormFields";
import type { Tipo } from "../types/tipo";

interface ModalTiposProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    tipo?: Tipo | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: { name: string; abbreviation?: string }) => Promise<void>;
    isLoading?: boolean;
}

export default function ModalTipos({
    isOpen,
    onOpenChange,
    tipo = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
}: ModalTiposProps) {
    const [initialValues, setInitialValues] = useState(getTipoInitialValues());

    useEffect(() => {
        if (tipo && mode === 'edit') {
            const mapped = mapTipoToFormValues(tipo);
            setInitialValues(mapped);
        } else {
            setInitialValues(getTipoInitialValues());
        }
    }, [tipo, mode]);

    const title = mode === 'create' ? 'Nuevo Tipo' : 'Editar Tipo';
    const submitLabel = mode === 'create' ? 'Crear' : 'Actualizar';

    const fields = getTipoFormFields();

    const handleSubmit = async (formData: Record<string, any>) => {
        const data = {
            name: formData.name,
            abbreviation: formData.abbreviation || undefined,
        };
        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getTipoFormGroups()}
            size="lg"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading}
        />
    );
}