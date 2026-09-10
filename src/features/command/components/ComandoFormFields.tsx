import { Cpu, FileText, InfoCircle, DangerTriangle } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface ComandoFormValues {
    waterMeterId: string;
    reason: string;
    details: string; 
}

export interface DetailItem {
    obisAttributeId: number;
    newValue: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

const DETAILS_EXAMPLE = `[
  {
    "obisAttributeId": 1,
    "newValue": "nuevo_valor"
  }
]`;

export const getComandoFormFields = (
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
            group: "Información del Comando",
            options: waterMeterOptions.length > 0 
                ? waterMeterOptions 
                : [{ value: "", label: "No hay medidores disponibles" }],
            validation: {
                required: "El medidor es requerido",
            },
        },
        {
            name: "reason",
            label: "Razón del Comando",
            type: "text",
            placeholder: "Ej: Configuración de parámetros, Ajuste de valores",
            required: true,
            colSpan: 2,
            startContent: <DangerTriangle size={16} className="text-default-400" />,
            group: "Información del Comando",
            validation: {
                required: "La razón del comando es requerida",
            },
        },
        {
            name: "details",
            label: "Detalles (JSON)",
            type: "textarea",
            placeholder: DETAILS_EXAMPLE,
            required: false,
            colSpan: 2,
            startContent: <FileText size={16} className="text-default-400" />,
            group: "Información del Comando",
            rows: 6,
            description: "Ingresa los detalles en formato JSON Array con obisAttributeId y newValue",
        },
    ];
};

export const getComandoFormGroups = (): FormGroup[] => [
    {
        title: "Información del Comando",
        icon: <InfoCircle size={18} weight="Bold" />,
        description: "Datos requeridos para enviar un comando",
        fields: ["waterMeterId", "reason", "details"],
    },
];

export const getComandoInitialValues = (): ComandoFormValues => ({
    waterMeterId: "",
    reason: "",
    details: "",
});

export const mapComandoToFormValues = (comando: any): ComandoFormValues => ({
    waterMeterId: String(comando?.waterMeterId || ""),
    reason: comando?.reason || "",
    details: JSON.stringify(comando?.details || [], null, 2),
});