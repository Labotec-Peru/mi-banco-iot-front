import { useState, useEffect, useMemo } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getComandoFormFields,
    getComandoFormGroups,
    getComandoInitialValues,
    mapComandoToFormValues,
    type SelectOption,
    type DetailItem,
} from "./ComandoFormFields";
import type { Comando } from "../types/comando";
import { useWaterMeters } from "@/features/medidores/hooks/useWaterMeters";

interface ModalComandoProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    comando?: Comando | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    waterMeterId?: number;
}

export default function ModalComando({
    isOpen,
    onOpenChange,
    comando = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
    waterMeterId,
}: ModalComandoProps) {
    const [initialValues, setInitialValues] = useState(getComandoInitialValues());

    const {
        waterMeters,
        isLoading: isLoadingWaterMeters
    } = useWaterMeters();

    const waterMeterOptions: SelectOption[] = useMemo(() => {
        if (!waterMeters || waterMeters.length === 0) {
            return [{ value: "", label: "No hay medidores disponibles" }];
        }

        let filteredMeters = waterMeters;
        if (waterMeterId) {
            filteredMeters = waterMeters.filter(m => m.id === waterMeterId);
        }

        return [
            { value: "", label: "Selecciona un medidor..." },
            ...filteredMeters.map((meter: any) => ({
                value: String(meter.id),
                label: `${meter.serialNumber} - ${meter.meterModel?.name || 'Sin modelo'}`,
            }))
        ];
    }, [waterMeters, waterMeterId]);

    useEffect(() => {
        if (comando && mode === 'edit') {
            const mapped = mapComandoToFormValues(comando);
            setInitialValues(mapped);
        } else {
            const defaultValues = getComandoInitialValues();
            if (waterMeterId) {
                defaultValues.waterMeterId = String(waterMeterId);
            }
            setInitialValues(defaultValues);
        }
    }, [comando, mode, waterMeterId]);

    const title = mode === 'create' ? 'Nuevo Comando' : 'Editar Comando';
    const submitLabel = mode === 'create' ? 'Enviar' : 'Actualizar';

    const fields = getComandoFormFields(waterMeterOptions);

    const handleSubmit = async (formData: Record<string, any>) => {
        let details: DetailItem[] = [];
        try {
            if (formData.details && typeof formData.details === 'string') {
                const parsed = JSON.parse(formData.details);
                if (Array.isArray(parsed)) {
                    details = parsed;
                }
            }
        } catch (e) {
            console.error('Error parsing details:', e);
        }

        const data = {
            waterMeterId: Number(formData.waterMeterId),
            reason: formData.reason || "",
            details: details,
        };

        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getComandoFormGroups()}
            size="lg"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading || isLoadingWaterMeters}
        />
    );
}