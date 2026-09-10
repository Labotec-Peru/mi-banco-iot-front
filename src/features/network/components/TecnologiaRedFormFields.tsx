import {  InfoCircle, Hashtag, WiFiRouterRound } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface TecnologiaRedFormValues {
    name: string;
    abbreviation?: string;
}

export const getTecnologiaRedFormFields = (): FormField[] => {
    return [
        {
            name: "name",
            label: "Nombre de la Tecnología",
            type: "text",
            placeholder: "Ingresa el nombre de la tecnología de red",
            required: true,
            colSpan: 2,
            startContent: <WiFiRouterRound size={16} className="text-default-400" />,
            group: "Información de la Tecnología",
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
            placeholder: "Ej: LTE, NB-IoT, LoRa, etc.",
            required: false,
            colSpan: 2,
            startContent: <Hashtag size={16} className="text-default-400" />,
            group: "Información de la Tecnología",
            validation: {
                maxLength: {
                    value: 10,
                    message: "La abreviatura no puede exceder los 10 caracteres",
                },
            },
        },
    ];
};

export const getTecnologiaRedFormGroups = (): FormGroup[] => [
    {
        title: "Información de la Tecnología",
        icon: <InfoCircle size={18} weight="Bold" />,
        description: "Datos requeridos para el registro de la tecnología de red",
        fields: ["name", "abbreviation"],
    },
];

export const getTecnologiaRedInitialValues = (): TecnologiaRedFormValues => ({
    name: "",
    abbreviation: "",
});

export const mapTecnologiaRedToFormValues = (tecnologia: any): TecnologiaRedFormValues => ({
    name: tecnologia?.name || "",
    abbreviation: tecnologia?.abbreviation || "",
});