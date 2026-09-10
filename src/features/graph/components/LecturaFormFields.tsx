// components/LecturaFormFields.tsx
import { Calendar, Hashtag, InfoCircle, Cpu } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface LecturaFormValues {
    waterMeterId: string;
    value: number | string;
    readingDate: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export const getLecturaFormFields = (
    waterMeterOptions: SelectOption[] = []
): FormField[] => {
    return [
        {
            name: "waterMeterId",
            label: "Medidor",
            type: "select",
            placeholder: "Selecciona el medidor",
            required: true,
            colSpan: 2,
            startContent: <Cpu size={16} className="text-default-400" />,
            group: "Información de la Lectura",
            options: waterMeterOptions.length > 0 
                ? waterMeterOptions 
                : [{ value: "", label: "No hay medidores disponibles" }],
            validation: {
                required: "El medidor es requerido",
            },
        },
        {
            name: "value",
            label: "Valor de Lectura",
            type: "number",
            placeholder: "Ingresa el valor de la lectura",
            required: true,
            colSpan: 2,
            startContent: <Hashtag size={16} className="text-default-400" />,
            group: "Información de la Lectura",
            validation: {
                required: "El valor es requerido",
                min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                },
            },
        },
        {
            name: "readingDate",
            label: "Fecha de Lectura",
            type: "date",
            placeholder: "Selecciona la fecha",
            required: true,
            colSpan: 2,
            startContent: <Calendar size={16} className="text-default-400" />,
            group: "Información de la Lectura",
            validation: {
                required: "La fecha es requerida",
            },
        },
    ];
};

export const getLecturaFormGroups = (): FormGroup[] => [
    {
        title: "Información de la Lectura",
        icon: <InfoCircle size={18} weight="Bold" />,
        description: "Datos requeridos para registrar la lectura",
        fields: ["waterMeterId", "value", "readingDate"],
    },
];

export const getLecturaInitialValues = (): LecturaFormValues => ({
    waterMeterId: "",
    value: "",
    readingDate: new Date().toISOString().split('T')[0],
});

export const mapLecturaToFormValues = (lectura: any): LecturaFormValues => ({
    waterMeterId: String(lectura?.waterMeterId || ""),
    value: lectura?.value || "",
    readingDate: lectura?.readingDate 
        ? new Date(lectura.readingDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
});