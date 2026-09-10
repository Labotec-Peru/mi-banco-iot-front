import { Buildings, Buildings2, InfoCircle } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface MarcaFormValues {
    name: string;
    manufacturerCompanyId: number | string;
}

export interface SelectOption {
    value: string;
    label: string;
}

export const getMarcaFormFields = (
    manufacturerOptions: SelectOption[] = []
): FormField[] => {
    return [
        {
            name: "name",
            label: "Nombre de la Marca",
            type: "text",
            placeholder: "Ingresa el nombre de la marca",
            required: true,
            colSpan: 2,
            startContent: <Buildings size={16} className="text-default-400" />,
            group: "Información de la Marca",
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
            name: "manufacturerCompanyId",
            label: "Empresa Fabricante",
            type: "select",
            placeholder: "Selecciona la empresa fabricante",
            required: true,
            colSpan: 2,
            startContent: <Buildings2 size={16} className="text-default-400" />,
            group: "Información de la Marca",
            options: manufacturerOptions.length > 0 
                ? manufacturerOptions 
                : [{ value: "", label: "No hay empresas disponibles" }],
            validation: {
                required: "La empresa fabricante es requerida",
            },
        },
    ];
};

export const getMarcaFormGroups = (): FormGroup[] => [
    {
        title: "Información de la Marca",
        icon: <InfoCircle size={18} weight="Bold" />,
        description: "Datos requeridos para el registro de la marca",
        fields: ["name", "manufacturerCompanyId"],
    },
];

export const getMarcaInitialValues = (): MarcaFormValues => ({
    name: "",
    manufacturerCompanyId: "",
});

export const mapMarcaToFormValues = (marca: any): MarcaFormValues => ({
    name: marca?.name || "",
    manufacturerCompanyId: marca?.manufacturerCompanyId ?? "",
});