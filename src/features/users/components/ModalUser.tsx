import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getUserFormFields,
    getUserFormGroups,
    getUserInitialValues,
    mapUserToFormValues,
    type SelectOption,
} from "./UserFormFields";
import type { User } from "../services/userApi";
import { useAttachments } from "@/features/attachment/hooks/useAttachments";
interface ModalUserProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export default function ModalUser({
    isOpen,
    onOpenChange,
    user = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
}: ModalUserProps) {
    const [initialValues, setInitialValues] = useState(getUserInitialValues());

    const { allAttachments, isLoading: isLoadingAttachments, refetch: refetchAttachments } = useAttachments();

    useEffect(() => {
        if (isOpen) {
            refetchAttachments();
        }
    }, [isOpen, refetchAttachments]);

    useEffect(() => {
        if (mode === 'edit' && user) {
            setInitialValues(mapUserToFormValues(user));
        } else {
            setInitialValues(getUserInitialValues());
        }
    }, [user, mode, isOpen]);

    const title = mode === 'create' ? 'Crear Usuario' : 'Editar Usuario';
    const submitLabel = mode === 'create' ? 'Crear' : 'Actualizar';

    const attachmentOptions: SelectOption[] = allAttachments.map((attachment: { id: any; filename: any; description: any; }) => ({
        value: String(attachment.id),
        label: `${attachment.filename}${attachment.description ? ` - ${attachment.description}` : ''}`,
    }));

    const fields = getUserFormFields([], [], attachmentOptions, mode);

    const handleSubmit = async (formData: Record<string, any>) => {
        const data: any = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            documentNumber: formData.documentNumber,
            documentType: formData.documentType,
            phone: formData.phone,
            timeZone: formData.timeZone,
            status: formData.status,
            imageUrl: formData.imageUrl,
            roles: formData.roles || [],
            scopes: formData.scopes || [],
            tagIds: formData.tagIds || [],
            groupIds: formData.groupIds || [],
            attachmentIds: formData.attachmentIds || [], 
            views: formData.views || [],
            notifications: formData.notifications || [],
            latitude: formData.latitude,
            longitude: formData.longitude,
        };

        if (mode === 'create' && formData.password) {
            data.password = formData.password;
        }

        if (formData.emails && typeof formData.emails === 'string') {
            data.emails = formData.emails.split(',').map((e: string) => e.trim()).filter(Boolean);
        } else {
            data.emails = formData.emails || [];
        }

        if (formData.phones && typeof formData.phones === 'string') {
            data.phones = formData.phones.split(',').map((p: string) => p.trim()).filter(Boolean);
        } else {
            data.phones = formData.phones || [];
        }

        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getUserFormGroups()}
            size="xl"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading || isLoadingAttachments}
        />
    );
}