// components/ModalSensorInstallation.tsx

import { useState, useEffect, useMemo } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getInstallationFormFields,
    getInstallationFormGroups,
    getInstallationInitialValues,
    type SelectOption,
} from "./InstallationFormFields";
import { useSensorInstallation } from "../hooks/useSensorInstallations";
import { useGetSensorsQuery } from "../services/sensorsApi";
import { useWaterMeters } from "@/features/medidores/hooks/useWaterMeters";
import { useUsers } from "@/features/users/hooks/useUsers";

interface ModalSensorInstallationProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    preselectedSensorId?: number | null;
    preselectedWaterMeterId?: number | null;
}

export default function ModalSensorInstallation({
    isOpen,
    onOpenChange,
    onSuccess,
    preselectedSensorId = null,
    preselectedWaterMeterId = null,
}: ModalSensorInstallationProps) {
    const [initialValues, setInitialValues] = useState(getInstallationInitialValues());
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    const { isSubmitting, createInstallation } = useSensorInstallation();

    const { data: sensorsData, isLoading: isLoadingSensors } = useGetSensorsQuery({
        page: 0,
        size: 999,
    });

    const { waterMeters, isLoading: isLoadingWaterMeters } = useWaterMeters();
    const { getTechnicianOptions, isLoading: isLoadingUsers } = useUsers(); 

    const waterMeterOptions: SelectOption[] = useMemo(() => {
        if (!waterMeters || waterMeters.length === 0) {
            return [{ value: "", label: "No hay medidores disponibles" }];
        }
        return [
            { value: "", label: "Selecciona un medidor..." },
            ...waterMeters.map((wm: any) => ({
                value: String(wm.id),
                label: `${wm.serialNumber || wm.id}${wm.customer?.name ? ` - ${wm.customer.name}` : ''}`,
            }))
        ];
    }, [waterMeters]);

    const sensorOptions: SelectOption[] = useMemo(() => {
        const sensors = sensorsData?.content || [];
        if (!sensors || sensors.length === 0) {
            return [{ value: "", label: "No hay sensores disponibles" }];
        }
        return [
            { value: "", label: "Selecciona un sensor..." },
            ...sensors.map((sensor: any) => ({
                value: String(sensor.id),
                label: `${sensor.serialNumber}${sensor.meterBrand?.name ? ` - ${sensor.meterBrand.name}` : ''}`,
            }))
        ];
    }, [sensorsData]);

    const technicianOptions: SelectOption[] = useMemo(() => {
        return getTechnicianOptions();
    }, [getTechnicianOptions]);

    useEffect(() => {
        const defaultValues = getInstallationInitialValues();
        if (preselectedSensorId) {
            defaultValues.sensorId = String(preselectedSensorId);
        }
        if (preselectedWaterMeterId) {
            defaultValues.waterMeterId = String(preselectedWaterMeterId);
        }
        setInitialValues(defaultValues);
        setFormValues(defaultValues);
    }, [preselectedSensorId, preselectedWaterMeterId]);

    const isSensorPreselected = !!preselectedSensorId;

    const fields = getInstallationFormFields(
        waterMeterOptions, 
        sensorOptions,
        technicianOptions, 
        isSensorPreselected
    );

    const handleSubmit = async (formData: Record<string, any>) => {
        const result = await createInstallation({
            waterMeterId: Number(formData.waterMeterId),
            sensorId: Number(formData.sensorId),
            technicianId: Number(formData.technicianId), 
            observation: formData.observation || "",
            previousRemovalReason: formData.previousRemovalReason || "NONE",
        });

        if (result.success) {
            onOpenChange(false);
            if (onSuccess) {
                onSuccess();
            }
        }
    };

    const mergedInitialValues = {
        ...initialValues,
        ...formValues
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Nueva Instalación"
            fields={fields}
            groups={getInstallationFormGroups()}
            size="lg"
            initialValues={mergedInitialValues}
            onSubmit={handleSubmit}
            submitLabel="Instalar"
            cancelLabel="Cancelar"
            isLoading={isSubmitting || isLoadingSensors || isLoadingWaterMeters || isLoadingUsers}
        />
    );
}