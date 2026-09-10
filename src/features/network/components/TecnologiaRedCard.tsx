import { Card, CardHeader, CardBody, Chip, Button } from "@heroui/react";
import { WiFiRouterRound, Pen2, TrashBin2 } from "@solar-icons/react";
import type { TecnologiaRed } from "../types/tecnologiaRed";

interface TecnologiaRedCardProps {
    tecnologia: TecnologiaRed;
    onEdit: (tecnologia: TecnologiaRed) => void;
    onDelete: (tecnologia: TecnologiaRed) => void;
}

export default function TecnologiaRedCard({ tecnologia, onEdit, onDelete }: TecnologiaRedCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <WiFiRouterRound size={20} className="text-primary" />
                    <span className="font-semibold">{tecnologia.name}</span>
                </div>
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        isIconOnly
                        onPress={() => onEdit(tecnologia)}
                    >
                        <Pen2 size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => onDelete(tecnologia)}
                    >
                        <TrashBin2 size={16} />
                    </Button>
                </div>
            </CardHeader>
            <CardBody>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-default-500">Abreviatura:</span>
                        <span className="text-sm">{tecnologia.abbreviation || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-default-500">Estado:</span>
                        <Chip 
                            color={tecnologia.status === 'ACTIVE' ? 'success' : 'default'} 
                            size="sm"
                        >
                            {tecnologia.status || "Activo"}
                        </Chip>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}