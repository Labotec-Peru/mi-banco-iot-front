import { File, FileText, Archive as ImageIcon, Link, Tag } from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface AttachmentFormValues {
    filename: string;
    fileUrl: string;
    fileType: string;
    description: string;
}

export interface SelectOption {
    value: string;
    label: string;
}

const fileTypeOptions: SelectOption[] = [
    { value: "IMAGE_JPEG", label: "JPEG" },
    { value: "IMAGE_PNG", label: "PNG" },
    { value: "IMAGE_GIF", label: "GIF" },
    { value: "PDF", label: "PDF" },
    { value: "DOCUMENT_DOC", label: "DOC" },
    { value: "DOCUMENT_DOCX", label: "DOCX" },
    { value: "SPREADSHEET_XLS", label: "XLS" },
    { value: "SPREADSHEET_XLSX", label: "XLSX" },
    { value: "VIDEO_MP4", label: "MP4" },
    { value: "AUDIO_MP3", label: "MP3" },
    { value: "OTHER", label: "Otro" },

];


export const getAttachmentFormFields = (_mode: 'create' | 'edit' = 'create'): FormField[] => {
    return [
        {
            name: "filename",
            label: "Nombre del Archivo",
            type: "text",
            placeholder: "Ingresa el nombre del archivo",
            required: true,
            colSpan: 2,
            startContent: <File size={16} className="text-default-400" />,
            group: "Información del Archivo",
        },
        {
            name: "fileUrl",
            label: "URL del Archivo",
            type: "text",
            placeholder: "https://ejemplo.com/archivo.pdf",
            required: true,
            colSpan: 2,
            startContent: <Link size={16} className="text-default-400" />,
            group: "Información del Archivo",
        },
        {
            name: "fileType",
            label: "Tipo de Archivo",
            type: "select",
            placeholder: "Selecciona el tipo de archivo",
            required: true,
            colSpan: 2,
            startContent: <ImageIcon size={16} className="text-default-400" />,
            group: "Información del Archivo",
            options: fileTypeOptions,
        },
        {
            name: "description",
            label: "Descripción",
            type: "textarea",
            placeholder: "Descripción del archivo (opcional)",
            required: false,
            colSpan: 2,
            startContent: <Tag size={16} className="text-default-400" />,
            group: "Información del Archivo",
            rows: 3,
        },
    ];
};

export const getAttachmentFormGroups = (): FormGroup[] => [
    {
        title: "Información del Archivo",
        icon: <FileText size={18} weight="Bold" />,
        description: "Datos del archivo adjunto",
        fields: ["filename", "fileUrl", "fileType", "description"],
    },
];

export const getAttachmentInitialValues = (): AttachmentFormValues => ({
    filename: "",
    fileUrl: "",
    fileType: "",
    description: "",
});

export const mapAttachmentToFormValues = (attachment: any): AttachmentFormValues => ({
    filename: attachment?.filename || "",
    fileUrl: attachment?.fileUrl || "",
    fileType: attachment?.fileType || "",
    description: attachment?.description || "",
});