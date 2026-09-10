import type { FilterFieldDef } from "../../../components/ux/TableComponent";

export const getAttachmentFilters = (): FilterFieldDef[] => [
    {
        key: "search",
        type: "text",
        placeholder: "Buscar por nombre o descripción...",
    },
    {
        key: "fileType",
        type: "select",
        placeholder: "Todos los tipos",
        options: [
            { value: "", label: "Todos los tipos" },
            { value: "image/jpeg", label: "JPEG" },
            { value: "image/png", label: "PNG" },
            { value: "image/gif", label: "GIF" },
            { value: "application/pdf", label: "PDF" },
            { value: "application/zip", label: "ZIP" },
            { value: "text/plain", label: "TXT" },
            { value: "application/msword", label: "DOC" },
            { value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", label: "DOCX" },
        ],
    },
];