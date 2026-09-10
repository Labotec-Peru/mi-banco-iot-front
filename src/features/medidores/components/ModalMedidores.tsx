import { useState, useEffect, useMemo } from "react";
import ModalComponent from "../../../components/ux/ModalComponent";
import {
    getMedidorFormFields,
    getMedidorFormGroups,
    getMedidorInitialValues,
    mapMedidorToFormValues
} from "./MedidorFormFields";
import type { Medidor } from "../types/medidor";
import type { CreateWaterMeterRequest, UpdateWaterMeterRequest } from "../types/waterMeter.types";
import { useMeterTypes } from "../hooks/useMeterTypes";
import { useMeterBrands } from "../hooks/useMeterBrands";
import { useMeterModels } from "../hooks/useMeterModels";
import { useNetworkTechnologies } from "@/features/network/hooks/useNetworkTechnologies";

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
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    const {
        types,
        isLoading: isLoadingTypes
    } = useMeterTypes();

    const {
        brands,
        isLoading: isLoadingBrands
    } = useMeterBrands();
    const {
        models,
        isLoading: isLoadingModels
    } = useMeterModels();
    const {
        technologies,
        isLoading: isLoadingTechnologies
    } = useNetworkTechnologies();
    const typeOptions = useMemo(() => {
        if (!types || types.length === 0) {
            return [{ value: "", label: "No hay tipos disponibles" }];
        }
        return [
            { value: "", label: "Selecciona un tipo..." },
            ...types.map((type: any) => ({
                value: String(type.id),
                label: type.name,
            }))
        ];
    }, [types]);

    const brandOptions = useMemo(() => {
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

    const modelOptions = useMemo(() => {
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

    const technologyOptions = useMemo(() => {
        if (!technologies || technologies.length === 0) {
            return [{ value: "", label: "No hay tecnologías disponibles" }];
        }
        return [
            { value: "", label: "Selecciona una tecnología..." },
            ...technologies.map((tech: any) => ({
                value: String(tech.id),
                label: tech.name,
            }))
        ];
    }, [technologies]);

    useEffect(() => {
        if (medidor && mode === 'edit') {
            const mapped = mapMedidorToFormValues(medidor);
            setInitialValues(mapped);
            setFormValues(mapped);
        } else {
            const defaultValues = getMedidorInitialValues();
            setInitialValues(defaultValues);
            setFormValues(defaultValues);
        }
    }, [medidor, mode]);

    const title = mode === 'create' ? 'Registrar Nuevo Medidor' : 'Editar Medidor';
    const submitLabel = mode === 'create' ? 'Registrar' : 'Actualizar';

    const fields = getMedidorFormFields({
        meterTypes: typeOptions,
        brands: brandOptions,
        models: modelOptions,
        technologies: technologyOptions,
        clientCompanies: [
            { value: "", label: "Selecciona una empresa cliente..." },
            { value: "1", label: "Empresa A" },
            { value: "2", label: "Empresa B" },
            { value: "3", label: "Empresa C" },
        ],
        providerCompanies: [
            { value: "", label: "Selecciona una empresa proveedora..." },
            { value: "1", label: "Proveedor A" },
            { value: "2", label: "Proveedor B" },
            { value: "3", label: "Proveedor C" },
        ],

    });

    const handleSubmit = async (formData: Record<string, any>) => {
        const data: CreateWaterMeterRequest = {
            serialNumber: formData.serialNumber,
            podCode: formData.podCode || "",
            imei: formData.imei || "",
            meterModelId: Number(formData.meterModelId),
            meterBrandId: Number(formData.meterBrandId),
            meterTypeId: Number(formData.meterTypeId),
            clientCompanyId: Number(formData.clientCompanyId),
            providerCompanyId: Number(formData.providerCompanyId),
            networkTechnologyId: Number(formData.networkTechnologyId) || 0,
            latitude: formData.latitude ? Number(formData.latitude) : 0,
            longitude: formData.longitude ? Number(formData.longitude) : 0,
            installationAddress: formData.installationAddress || "",
            ubigeoCode: formData.ubigeoCode || "",
            initialValue: formData.initialValue ? Number(formData.initialValue) : 0,
            installationDate: formData.installationDate || new Date().toISOString(),
            connectionType: formData.connectionType || "",  
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
            groups={getMedidorFormGroups()}
            size="xl"
            initialValues={mergedInitialValues}
            onSubmit={handleSubmit}
            submitLabel={submitLabel}
            cancelLabel="Cancelar"
            isLoading={isLoading || isLoadingTypes || isLoadingBrands || isLoadingModels || isLoadingTechnologies}
        />
    );
}