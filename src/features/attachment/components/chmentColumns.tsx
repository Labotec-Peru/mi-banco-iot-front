import { Button, Chip, Tooltip, Link, Image } from "@heroui/react";
import { Eye, Pen2, TrashBinTrash, Explicit, File } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Attachment } from "../services/attachmentApi";

interface AttachmentColumnsProps {
    onView?: (attachment: Attachment) => void;
    onEdit?: (attachment: Attachment) => void;
    onDelete?: (attachment: Attachment) => void;
}

export const getAttachmentColumns = ({
    onView,
    onEdit,
    onDelete,
}: AttachmentColumnsProps): CustomColumnDef<Attachment>[] => [
    {
        key: "filename",
        label: "ARCHIVO",
        width: 200,
        sortable: true,
        render: (attachment) => (
            <div className="flex items-center gap-2">
                {attachment.fileType?.startsWith('image/') ? (
                    <Image
                        src={attachment.fileUrl}
                        alt={attachment.filename}
                        className="w-8 h-8 object-cover rounded"
                        radius="sm"
                    />
                ) : (
                    <div className="w-8 h-8 bg-default-100 rounded flex items-center justify-center">
                        <File size={16} className="text-default-600" />
                    </div>
                )}
                <div>
                    <div className="font-medium text-sm truncate max-w-[120px]">
                        {attachment.filename}
                    </div>
                    <div className="text-xs text-default-400">
                        {attachment.fileType || "—"}
                    </div>
                </div>
            </div>
        ),
    },
    {
        key: "description",
        label: "DESCRIPCIÓN",
        width: 200,
        sortable: false,
        render: (attachment) => (
            <span className="text-sm text-default-600">
                {attachment.description || "—"}
            </span>
        ),
    },
    {
        key: "fileType",
        label: "TIPO",
        width: 130,
        sortable: true,
        render: (attachment) => {
            const typeMap: Record<string, { color: "primary" | "secondary" | "success" | "warning" | "danger" | "default"; label: string }> = {
                'image/jpeg': { color: "primary", label: "Imagen" },
                'image/png': { color: "primary", label: "Imagen" },
                'image/gif': { color: "primary", label: "Imagen" },
                'application/pdf': { color: "danger", label: "PDF" },
                'application/zip': { color: "warning", label: "ZIP" },
                'text/plain': { color: "secondary", label: "Texto" },
                'application/msword': { color: "success", label: "DOC" },
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { color: "success", label: "DOCX" },
            };
            const type = typeMap[attachment.fileType || ''] || { color: "default", label: attachment.fileType || "Desconocido" };
            return <Chip color={type.color} size="sm">{type.label}</Chip>;
        },
    },
    {
        key: "created",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (attachment) => (
            <span className="text-default-600 text-sm">
                {attachment.created ? new Date(attachment.created).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }) : "—"}
            </span>
        ),
    },
    {
        key: "fileUrl",
        label: "URL",
        width: 150,
        sortable: false,
        render: (attachment) => (
            <Link
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1"
            >
                <Explicit size={14} />
                Ver archivo
            </Link>
        ),
    },
    {
        key: "acciones",
        label: "ACCIONES",
        width: 120,
        sortable: false,
        align: "center",
        render: (attachment) => (
            <div className="flex items-center justify-center gap-1">
                {onView && (
                    <Tooltip content="Ver" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => onView(attachment)}
                        >
                            <Eye size={16} />
                        </Button>
                    </Tooltip>
                )}
                {onEdit && (
                    <Tooltip content="Editar" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="warning"
                            onPress={() => onEdit(attachment)}
                        >
                            <Pen2 size={16} />
                        </Button>
                    </Tooltip>
                )}
                {onDelete && (
                    <Tooltip content="Eliminar" size="sm" color="danger">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => onDelete(attachment)}
                        >
                            <TrashBinTrash size={16} />
                        </Button>
                    </Tooltip>
                )}
            </div>
        ),
    },
];