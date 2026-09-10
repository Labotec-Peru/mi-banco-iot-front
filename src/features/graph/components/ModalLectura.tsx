import { useState, useEffect, useMemo } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getLecturaFormFields,
    getLecturaFormGroups,
    getLecturaInitialValues,
    type SelectOption,
} from "./LecturaFormFields";
import type { Lectura } from "../types/lectura";
import { useWaterMeters } from "@/features/medidores/hooks/useWaterMeters";

interface ModalLecturaProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    lectura?: Lectura | null;
    mode?: 'create';
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    waterMeterId?: number;
}

export default function ModalLectura({
    isOpen,
    onOpenChange,
    onSubmit,
    isLoading = false,
    waterMeterId,
}: ModalLecturaProps) {
    const [initialValues, setInitialValues] = useState(getLecturaInitialValues());

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
        const defaultValues = getLecturaInitialValues();
        if (waterMeterId) {
            defaultValues.waterMeterId = String(waterMeterId);
        }
        setInitialValues(defaultValues);
    }, [waterMeterId]);

    const title = 'Registrar Lectura';
    const submitLabel = 'Registrar';

    const fields = getLecturaFormFields(waterMeterOptions);

    const handleSubmit = async (formData: Record<string, any>) => {
        const data = {
            waterMeterId: Number(formData.waterMeterId),
            value: Number(formData.value),
            readingDate: formData.readingDate || new Date().toISOString(),
        };
        await onSubmit(data);
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getLecturaFormGroups()}
            size="lg"
            initialValues={initialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading || isLoadingWaterMeters}
        />
    );
}