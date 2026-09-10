import { Button, Chip, Tooltip } from "@heroui/react";
import { PenNewSquare, CheckCircle, Screencast } from "@solar-icons/react";
import type { CustomColumnDef } from "../../../components/ux/TableComponent";
import type { Sensor } from "../types/sensor";

interface SensorColumnsProps {
    onEdit: (sensor: Sensor) => void;
    onInstall?: (sensor: Sensor) => void;
    getInstallationStatus?: (sensor: Sensor) => { isInstalled: boolean; waterMeterId?: number };
}

export const getSensorColumns = ({
    onEdit,
    onInstall,
    getInstallationStatus,
}: SensorColumnsProps): CustomColumnDef<Sensor>[] => [
    {
        key: "id",
        label: "ID",
        width: 80,
        sortable: true,
        render: (sensor) => <span className="font-mono text-sm">{sensor.id}</span>,
    },
    {
        key: "serialNumber",
        label: "NÚMERO DE SERIE",
        width: 200,
        sortable: true,
        render: (sensor) => (
            <div className="flex items-center gap-2">
                <span className="font-semibold text-default-800">{sensor.serialNumber}</span>
            </div>
        ),
    },
    {
        key: "meterBrandId",
        label: "MARCA",
        width: 150,
        sortable: true,
        render: (sensor) => (
            <span className="text-default-600">
                {sensor.meterBrand?.name || sensor.meterBrandId || "—"}
            </span>
        ),
    },
    {
        key: "meterModelId",
        label: "MODELO",
        width: 150,
        sortable: true,
        render: (sensor) => (
            <span className="text-default-600">
                {sensor.meterModel?.name || sensor.meterModelId || "—"}
            </span>
        ),
    },
    {
        key: "firmwareVersion",
        label: "FIRMWARE",
        width: 150,
        sortable: true,
        render: (sensor) => (
            <span className="text-default-600">
                {sensor.firmwareVersion || (
                    <span className="text-default-400 text-sm italic">Sin versión</span>
                )}
            </span>
        ),
    },
    {
        key: "status",
        label: "ESTADO",
        width: 120,
        sortable: true,
        render: (sensor) => {
            const statusMap: Record<string, { color: "success" | "warning" | "danger" | "default"; label: string }> = {
                ACTIVE: { color: "success", label: "Activo" },
                INACTIVE: { color: "warning", label: "Inactivo" },
                DELETED: { color: "danger", label: "Eliminado" },
            };
            const status = statusMap[sensor.status || 'ACTIVE'] || { color: "default", label: sensor.status || "Activo" };
            return <Chip color={status.color} size="sm">{status.label}</Chip>;
        },
    },
    {
        key: "createdAt",
        label: "CREADO",
        width: 180,
        sortable: true,
        render: (sensor) => (
            <span className="text-default-600 text-sm">
                {sensor.createdAt ? new Date(sensor.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : "—"}
            </span>
        ),
    },
    {
        key: "acciones",
        label: "ACCIONES",
        width: 120,
        sortable: false,
        align: "center",
        render: (sensor) => {
            const installationStatus = getInstallationStatus?.(sensor);
            const isInstalled = installationStatus?.isInstalled || false;

            return (
                <div className="flex items-center justify-center gap-1">
                    <Tooltip content="Editar" size="sm">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            onPress={() => onEdit(sensor)}
                        >
                            <PenNewSquare size={16} className="text-default-500" />
                        </Button>
                    </Tooltip>
                    
                    {onInstall && (
                        <Tooltip 
                            content={isInstalled ? "Sensor ya instalado" : "Instalar sensor"} 
                            size="sm"
                        >
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                color={isInstalled ? "success" : "primary"}
                                onPress={() => !isInstalled && onInstall(sensor)}
                                isDisabled={isInstalled}
                            >
                                {isInstalled ? (
                                    <CheckCircle size={16} className="text-success" />
                                ) : (
                                    <Screencast size={16} className="text-primary" />
                                )}
                            </Button>
                        </Tooltip>
                    )}
                </div>
            );
        },
    },
];