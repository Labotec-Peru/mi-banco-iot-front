import { 
    Waterdrop, 
    Notebook2, 
    ShieldWarning,
    CheckCircle,
    User,
    Cpu  // ← Agregar icono para el sensor
} from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface SensorInstallationFormValues {
    waterMeterId: string;
    sensorId: string;
    technicianId: string; 
    observation: string;
    previousRemovalReason: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export const REMOVAL_REASON_OPTIONS = [
    { value: "FAILURE", label: "Falla" },
    { value: "MAINTENANCE", label: "Mantenimiento" },
    { value: "UPGRADE", label: "Actualización" },
    { value: "OTHER", label: "Otro" },
    { value: "NONE", label: "Sin motivo" },
] as const;

export type RemovalReason = typeof REMOVAL_REASON_OPTIONS[number]['value'];

export const getInstallationFormFields = (
    waterMeterOptions: SelectOption[] = [],
    sensorOptions: SelectOption[] = [],       
    technicianOptions: SelectOption[] = [],   
    isSensorPreselected: boolean = false      
): FormField[] => {
    return [
        {
            name: "sensorId",
            label: "Sensor",
            type: "select",
            placeholder: isSensorPreselected 
                ? "Sensor preseleccionado" 
                : "Selecciona un sensor",
            required: true,
            colSpan: 2,
            startContent: <Cpu size={16} className="text-default-400" />,
            group: "Datos de Instalación",
            options: sensorOptions.length > 0 
                ? sensorOptions 
                : [{ value: "", label: "No hay sensores disponibles" }],
            disabled: isSensorPreselected,  
            validation: {
                required: "El sensor es requerido",
            },
        },
        {
            name: "waterMeterId",
            label: "Medidor de Agua",
            type: "select",
            placeholder: "Selecciona un medidor de agua",
            required: true,
            colSpan: 2,
            startContent: <Waterdrop size={16} className="text-default-400" />,
            group: "Datos de Instalación",
            options: waterMeterOptions.length > 0 
                ? waterMeterOptions 
                : [{ value: "", label: "No hay medidores disponibles" }],
            validation: {
                required: "El medidor de agua es requerido",
            },
        },       
        {
            name: "technicianId",
            label: "Técnico Responsable",
            type: "select",
            placeholder: "Selecciona el técnico responsable",
            required: true,
            colSpan: 2,
            startContent: <User size={16} className="text-default-400" />,
            group: "Datos de Instalación",
            options: technicianOptions.length > 0 
                ? [
                    { value: "", label: "Selecciona un técnico..." },
                    ...technicianOptions
                  ]
                : [{ value: "", label: "No hay técnicos disponibles" }],
            validation: {
                required: "El técnico responsable es requerido",
            },
        },
        {
            name: "previousRemovalReason",
            label: "Motivo de Remoción Anterior",
            type: "select",
            placeholder: "Selecciona el motivo (opcional)",
            required: false,
            colSpan: 2,
            startContent: <ShieldWarning size={16} className="text-default-400" />,
            group: "Datos de Instalación",
            options: [
                { value: "", label: "Sin motivo específico" },
                ...REMOVAL_REASON_OPTIONS.map(opt => ({
                    value: opt.value,
                    label: opt.label,
                })),
            ],
        },
        {
            name: "observation",
            label: "Observaciones",
            type: "textarea",
            placeholder: "Ingresa observaciones sobre la instalación (opcional)",
            required: false,
            colSpan: 2,
            rows: 4,
            startContent: <Notebook2 size={16} className="text-default-400" />,
            group: "Datos de Instalación",
            validation: {
                maxLength: {
                    value: 500,
                    message: "Las observaciones no pueden exceder los 500 caracteres",
                },
            },
        },
    ];
};

export const getInstallationFormGroups = (): FormGroup[] => [
    {
        title: "Datos de Instalación",
        icon: <CheckCircle size={18} weight="Bold" />,
        description: "Información para la instalación del sensor en el medidor",
        fields: ["sensorId", "waterMeterId", "technicianId", "previousRemovalReason", "observation"], 
    },
];

export const getInstallationInitialValues = (): SensorInstallationFormValues => ({
    waterMeterId: "",
    sensorId: "",
    technicianId: "", 
    observation: "",
    previousRemovalReason: "",
});

export const mapInstallationToFormValues = (installation: any): SensorInstallationFormValues => ({
    waterMeterId: String(installation?.waterMeterId || ""),
    sensorId: String(installation?.sensorId || ""),
    technicianId: String(installation?.technicianId || ""), 
    observation: installation?.observation || "",
    previousRemovalReason: installation?.previousRemovalReason || "",
});

export const mapFormToInstallationRequest = (formData: Record<string, any>) => ({
    waterMeterId: Number(formData.waterMeterId),
    sensorId: Number(formData.sensorId),
    technicianId: Number(formData.technicianId), 
    observation: formData.observation || "",
    previousRemovalReason: formData.previousRemovalReason || "NONE",
});