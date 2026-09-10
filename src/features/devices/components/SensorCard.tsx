import { Card, CardHeader, CardBody, Chip, Button } from "@heroui/react";
import { Cpu, Pen2 } from "@solar-icons/react";
import type { Sensor } from "../types/sensor";

interface SensorCardProps {
    sensor: Sensor;
    onEdit: (sensor: Sensor) => void;
}

export default function SensorCard({ sensor, onEdit }: SensorCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Cpu size={20} className="text-primary" />
                    <span className="font-semibold">{sensor.serialNumber}</span>
                </div>
                <Button
                    size="sm"
                    variant="light"
                    color="primary"
                    isIconOnly
                    onPress={() => onEdit(sensor)}
                >
                    <Pen2 size={16} />
                </Button>
            </CardHeader>
            <CardBody>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-default-500">Marca:</span>
                        <span className="text-sm">{sensor.meterBrand?.name || sensor.meterBrandId || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-default-500">Modelo:</span>
                        <span className="text-sm">{sensor.meterModel?.name || sensor.meterModelId || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-default-500">Firmware:</span>
                        <span className="text-sm">{sensor.firmwareVersion || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-default-500">Estado:</span>
                        <Chip 
                            color={sensor.status === 'ACTIVE' ? 'success' : 'default'} 
                            size="sm"
                        >
                            {sensor.status || "Activo"}
                        </Chip>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}