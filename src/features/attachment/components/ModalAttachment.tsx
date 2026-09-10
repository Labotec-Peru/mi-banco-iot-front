import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getAttachmentFormFields,
    getAttachmentFormGroups,
    getAttachmentInitialValues,
    mapAttachmentToFormValues,        
} from "./AttachmentFormFields";
import type { Attachment } from "../services/attachmentApi";

interface ModalAttachmentProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    attachment?: Attachment | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export default function ModalAttachment({
    isOpen,
    onOpenChange,
    attachment = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
}: ModalAttachmentProps) {
    const [initialValues, setInitialValues] = useState(getAttachmentInitialValues());

    useEffect(() => {
        if (mode === 'edit' && attachment) {
            setInitialValues(mapAttachmentToFormValues(attachment));
        } else {
            setInitialValues(getAttachmentInitialValues());
        }
    }, [attachment, mode, isOpen]);

    const title = mode === 'create' ? 'Subir Archivo' : 'Editar Archivo';
    const submitLabel = mode === 'create' ? 'Subir' : 'Actualizar';

    const fields = getAttachmentFormFields(mode);

    const handleSubmit = async (formData: Record<string, any>) => {
        const data = {
            filename: formData.filename,
            fileUrl: formData.fileUrl,
            fileType: formData.fileType,
            description: formData.description || "",
        };
        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getAttachmentFormGroups()}
            size="md"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading}
        />
    );
}