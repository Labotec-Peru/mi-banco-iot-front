import { useState, useEffect, useMemo } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getSensorFormFields,
    getSensorFormGroups,
    getSensorInitialValues,
    mapSensorToFormValues,
    type SelectOption,
} from "./SensorFormFields";
import type { Sensor } from "../types/sensor";
import { useMeterBrands } from "@/features/medidores/hooks/useMeterBrands";
import { useMeterModels } from "@/features/medidores/hooks/useMeterModels";

interface ModalSensorProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    sensor?: Sensor | null;
    mode?: 'create' | 'edit';
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export default function ModalSensor({
    isOpen,
    onOpenChange,
    sensor = null,
    mode = 'create',
    onSubmit,
    isLoading = false,
}: ModalSensorProps) {
    const [initialValues, setInitialValues] = useState(getSensorInitialValues());
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    const {
        brands,
        isLoading: isLoadingBrands
    } = useMeterBrands();

    const {
        models,
        isLoading: isLoadingModels
    } = useMeterModels();

    const brandOptions: SelectOption[] = useMemo(() => {
        if (!brands || brands.length === 0) {
            return [{ value: "", label: "No hay marcas disponibles" }];
        }
        return [
            { value: "", label: "Selecciona una marca..." },
            ...brands.map((brand: any) => ({
                value: String(brand.id),
                label: brand.name,
            }))
        ];
    }, [brands]);

    const modelOptions: SelectOption[] = useMemo(() => {
        if (!models || models.length === 0) {
            return [{ value: "", label: "No hay modelos disponibles" }];
        }
        
        const selectedBrandId = formValues.meterBrandId || initialValues.meterBrandId;
        
        let filteredModels = models;
        if (selectedBrandId) {
            filteredModels = models.filter((model: any) => 
                String(model.meterBrandId) === String(selectedBrandId)
            );
        }

        return [
            { value: "", label: selectedBrandId ? "Selecciona un modelo..." : "Primero selecciona una marca" },
            ...filteredModels.map((model: any) => ({
                value: String(model.id),
                label: model.name,
            }))
        ];
    }, [models, formValues.meterBrandId, initialValues.meterBrandId]);

    useEffect(() => {
        if (sensor && mode === 'edit') {
            const mapped = mapSensorToFormValues(sensor);
            setInitialValues(mapped);
            setFormValues(mapped);
        } else {
            const defaultValues = getSensorInitialValues();
            setInitialValues(defaultValues);
            setFormValues(defaultValues);
        }
    }, [sensor, mode]);

    const title = mode === 'create' ? 'Nuevo Sensor' : 'Editar Sensor';
    const submitLabel = mode === 'create' ? 'Crear' : 'Actualizar';

    const fields = getSensorFormFields(brandOptions, modelOptions);

    const handleSubmit = async (formData: Record<string, any>) => {
        const data = {
            serialNumber: formData.serialNumber,
            meterBrandId: Number(formData.meterBrandId),
            meterModelId: Number(formData.meterModelId),
            firmwareVersion: formData.firmwareVersion || undefined,
            imei: formData.imei,
            devicePassword: formData.devicePassword,
            
        };
        await onSubmit(data);
    };

    const mergedInitialValues = {
        ...initialValues,
        ...formValues
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={title}
            fields={fields}
            groups={getSensorFormGroups()}
            size="lg"
            initialValues={mergedInitialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading || isLoadingBrands || isLoadingModels}
        />
    );
}