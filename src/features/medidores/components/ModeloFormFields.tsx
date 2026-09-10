import { Cpu, FileText, InfoCircle, Buildings } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface ModeloFormValues {
    name: string;
    description?: string;
    meterBrandId: number | string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export const getModeloFormFields = (
    brandOptions: SelectOption[] = []
): FormField[] => {
    return [
        {
            name: "name",
            label: "Nombre del Modelo",
            type: "text",
            placeholder: "Ingresa el nombre del modelo",
            required: true,
            colSpan: 2,
            startContent: <Cpu size={16} className="text-default-400" />,
            group: "Información del Modelo",
            validation: {
                required: "El nombre es requerido",
                minLength: {
                    value: 2,
                    message: "El nombre debe tener al menos 2 caracteres",
                },
                maxLength: {
                    value: 100,
                    message: "El nombre no puede exceder los 100 caracteres",
                },
            },
        },
        {
            name: "meterBrandId",
            label: "Marca",
            type: "select",
            placeholder: "Selecciona la marca",
            required: true,
            colSpan: 2,
            startContent: <Buildings size={16} className="text-default-400" />,
            group: "Información del Modelo",
            options: brandOptions.length > 0 
                ? brandOptions 
                : [{ value: "", label: "No hay marcas disponibles" }],
            validation: {
                required: "La marca es requerida",
            },
        },
        {
            name: "description",
            label: "Descripción",
            type: "textarea",
            placeholder: "Ingresa una descripción del modelo",
            required: false,
            colSpan: 2,
            startContent: <FileText size={16} className="text-default-400" />,
            group: "Información del Modelo",
            rows: 3,
        },
    ];
};

export const getModeloFormGroups = (): FormGroup[] => [
    {
        title: "Información del Modelo",
        icon: <InfoCircle size={18} weight="Bold" />,
        description: "Datos requeridos para el registro del modelo",
        fields: ["name", "meterBrandId", "description"],
    },
];

export const getModeloInitialValues = (): ModeloFormValues => ({
    name: "",
    description: "",
    meterBrandId: "",
});

export const mapModeloToFormValues = (modelo: any): ModeloFormValues => ({
    name: modelo?.name || "",
    description: modelo?.description || "",
    meterBrandId: modelo?.meterBrandId ?? "",
});