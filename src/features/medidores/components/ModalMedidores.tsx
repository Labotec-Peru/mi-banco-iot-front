
import { useState, useEffect } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import { 
    getMedidorFormFields, 
    getMedidorFormGroups,
    getMedidorInitialValues,
    mapMedidorToFormValues 
} from "./MedidorFormFields";
import type { Medidor } from "../types/medidor";
import type { CreateWaterMeterRequest, UpdateWaterMeterRequest } from "../types/waterMeter.types";

interface ModalMedidoresProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    medidor?: Medidor | null;
    onSubmit: (data: CreateWaterMeterRequest | UpdateWaterMeterRequest) => Promise<void>;
    isLoading?: boolean;
    mode?: 'create' | 'edit';
}

export default function ModalMedidores({
    isOpen,
    onOpenChange,
    medidor = null,
    onSubmit,
    isLoading = false,
    mode = 'create',
}: ModalMedidoresProps) {
    const [initialValues, setInitialValues] = useState(getMedidorInitialValues());

    useEffect(() => {
        if (medidor && mode === 'edit') {
            setInitialValues(mapMedidorToFormValues(medidor));
        } else {
            setInitialValues(getMedidorInitialValues());
        }
    }, [medidor, mode]);

    const title = mode === 'create' ? 'Registrar Nuevo Medidor' : 'Editar Medidor';
    const submitLabel = mode === 'create' ? 'Registrar' : 'Actualizar';

    const handleSubmit = async (formData: Record<string, any>) => {
        const data: CreateWaterMeterRequest = {
            serialNumber: formData.serialNumber,
            podCode: formData.podCode,
            imei: formData.imei,
            meterModelId: Number(formData.meterModelId),
            meterBrandId: Number(formData.meterBrandId),
            meterTypeId: Number(formData.meterTypeId),
            clientCompanyId: Number(formData.clientCompanyId),
            providerCompanyId: Number(formData.providerCompanyId),
            networkTechnologyId: Number(formData.networkTechnologyId),
            latitude: formData.latitude || 0,
            longitude: formData.longitude || 0,
            installationAddress: formData.installationAddress,
            ubigeoCode: formData.ubigeoCode,
            initialValue: formData.initialValue || 0,
            installationDate: formData.installationDate || new Date().toISOString(),
        };

        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={getMedidorFormFields()}
            groups={getMedidorFormGroups()} 
            size="xl"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading}
        />
    );
}