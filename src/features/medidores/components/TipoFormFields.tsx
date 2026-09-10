import { InfoCircle, Hashtag, Tag } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface TipoFormValues {
    name: string;
    abbreviation?: string;
}

export const getTipoFormFields = (): FormField[] => {
    return [
        {
            name: "name",
            label: "Nombre del Tipo",
            type: "text",
            placeholder: "Ingresa el nombre del tipo",
            required: true,
            colSpan: 2,
            startContent: <Tag size={16} className="text-default-400" />,
            group: "Información del Tipo",
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
            name: "abbreviation",
            label: "Abreviatura",
            type: "text",
            placeholder: "Ej: MT, MED, etc.",
            required: false,
            colSpan: 2,
            startContent: <Hashtag size={16} className="text-default-400" />,
            group: "Información del Tipo",
            validation: {
                maxLength: {
                    value: 10,
                    message: "La abreviatura no puede exceder los 10 caracteres",
                },
            },
        },
    ];
};

export const getTipoFormGroups = (): FormGroup[] => [
    {
        title: "Información del Tipo",
        icon: <InfoCircle size={18} weight="Bold" />,
        description: "Datos requeridos para el registro del tipo",
        fields: ["name", "abbreviation"],
    },
];

export const getTipoInitialValues = (): TipoFormValues => ({
    name: "",
    abbreviation: "",
});

export const mapTipoToFormValues = (tipo: any): TipoFormValues => ({
    name: tipo?.name || "",
    abbreviation: tipo?.abbreviation || "",
});