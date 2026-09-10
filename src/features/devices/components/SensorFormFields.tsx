import { Cpu, InfoCircle, Buildings, Hashtag, WiFiRouterRound, Lock } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";
import { HandHeart } from "@solar-icons/react/ssr";

export interface SensorFormValues {
    serialNumber: string;
    meterBrandId: string;
    meterModelId: string;
    firmwareVersion?: string;
    imei?: string;
    devicePassword?: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export const getSensorFormFields = (
    brandOptions: SelectOption[] = [],
    modelOptions: SelectOption[] = []
): FormField[] => {
    return [
        {
            name: "serialNumber",
            label: "Número de Serie",
            type: "text",
            placeholder: "Ingresa el número de serie del sensor",
            required: true,
            colSpan: 2,
            startContent: <Hashtag size={16} className="text-default-400" />,
            group: "Información del Sensor",
            validation: {
                required: "El número de serie es requerido",
                minLength: {
                    value: 3,
                    message: "El número de serie debe tener al menos 3 caracteres",
                },
                maxLength: {
                    value: 50,
                    message: "El número de serie no puede exceder los 50 caracteres",
                },
            },
        },
        {
            name: "devicePassword",
            label: "Contraseña del Dispositivo",
            type: "password", 
            placeholder: "Ingresa la contraseña del dispositivo",
            required: true,
            colSpan: 2,
            startContent: <Lock size={16} className="text-default-400" />, 
            group: "Información del Sensor",
            validation: {
                required: "La contraseña es requerida",
                minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                },
                maxLength: {
                    value: 50,
                    message: "La contraseña no puede exceder los 50 caracteres",
                },
            },
        },
        {
            name: "imei",
            label: "IMEI",
            type: "text",
            placeholder: "Ingresa el Imei del sensor",
            required: true,
            colSpan: 2,
            startContent: <HandHeart size={16} className="text-default-400" />,
            group: "Información del Sensor",
            validation: {
                required: "El imei es requerido",
                minLength: {
                    value: 3,
                    message: "El imei debe tener al menos 3 caracteres",
                },
                maxLength: {
                    value: 50,
                    message: "El imei exceder los 50 caracteres",
                },
            },
        },
        {
            name: "meterBrandId",
            label: "Marca",
            type: "select",
            placeholder: "Selecciona la marca",
            required: true,
            colSpan: 1,
            startContent: <Buildings size={16} className="text-default-400" />,
            group: "Información del Sensor",
            options: brandOptions.length > 0
                ? brandOptions
                : [{ value: "", label: "No hay marcas disponibles" }],
            validation: {
                required: "La marca es requerida",
            },
        },
        {
            name: "meterModelId",
            label: "Modelo",
            type: "select",
            placeholder: "Selecciona el modelo",
            required: true,
            colSpan: 1,
            startContent: <Cpu size={16} className="text-default-400" />,
            group: "Información del Sensor",
            options: modelOptions.length > 0
                ? modelOptions
                : [{ value: "", label: "No hay modelos disponibles" }],
            validation: {
                required: "El modelo es requerido",
            },
        },
        {
            name: "firmwareVersion",
            label: "Versión de Firmware",
            type: "text",
            placeholder: "Ej: v1.0.0, 2.3.1",
            required: false,
            colSpan: 2,
            startContent: <WiFiRouterRound size={16} className="text-default-400" />,
            group: "Información del Sensor",
            validation: {
                maxLength: {
                    value: 20,
                    message: "La versión no puede exceder los 20 caracteres",
                },
            },
        },
    ];
};

export const getSensorFormGroups = (): FormGroup[] => [
    {
        title: "Información del Sensor",
        icon: <InfoCircle size={18} weight="Bold" />,
        description: "Datos requeridos para el registro del sensor",
        fields: ["serialNumber", "meterBrandId", "meterModelId", "firmwareVersion"],
    },
];

export const getSensorInitialValues = (): SensorFormValues => ({
    serialNumber: "",
    meterBrandId: "",
    meterModelId: "",
    firmwareVersion: "",
    imei: "",
    devicePassword: "",
});

export const mapSensorToFormValues = (sensor: any): SensorFormValues => ({
    serialNumber: sensor?.serialNumber || "",
    meterBrandId: String(sensor?.meterBrandId || ""),
    meterModelId: String(sensor?.meterModelId || ""),
    firmwareVersion: sensor?.firmwareVersion || "",
    imei: sensor?.imei || "",
    devicePassword: sensor?.devicePassword || "", 
});