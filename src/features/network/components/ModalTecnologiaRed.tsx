import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getTecnologiaRedFormFields,
    getTecnologiaRedFormGroups,
    getTecnologiaRedInitialValues,
    mapTecnologiaRedToFormValues,
} from "./TecnologiaRedFormFields";
import type { TecnologiaRed } from "../types/tecnologiaRed";

interface ModalTecnologiaRedProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    tecnologia?: TecnologiaRed | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: { name: string; abbreviation?: string }) => Promise<void>;
    isLoading?: boolean;
}

export default function ModalTecnologiaRed({
    isOpen,
    onOpenChange,
    tecnologia = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
}: ModalTecnologiaRedProps) {
    const [initialValues, setInitialValues] = useState(getTecnologiaRedInitialValues());

    useEffect(() => {
        if (tecnologia && mode === 'edit') {
            const mapped = mapTecnologiaRedToFormValues(tecnologia);
            setInitialValues(mapped);
        } else {
            setInitialValues(getTecnologiaRedInitialValues());
        }
    }, [tecnologia, mode]);

    const title = mode === 'create' ? 'Nueva Tecnología de Red' : 'Editar Tecnología de Red';
    const submitLabel = mode === 'create' ? 'Crear' : 'Actualizar';

    const fields = getTecnologiaRedFormFields();

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
            groups={getTecnologiaRedFormGroups()}
            size="lg"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading}
        />
    );
}