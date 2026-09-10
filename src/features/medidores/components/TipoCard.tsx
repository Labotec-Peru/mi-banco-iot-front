import { Card, CardHeader, CardBody, Chip, Button } from "@heroui/react";
import { Tag, Pen2, TrashBin2 } from "@solar-icons/react";
import type { Tipo } from "../types/tipo";

interface TipoCardProps {
    tipo: Tipo;
    onEdit: (tipo: Tipo) => void;
    onDelete: (tipo: Tipo) => void;
}

export default function TipoCard({ tipo, onEdit, onDelete }: TipoCardProps) {
    return (
        <Card className="w-full">
            <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Tag size={20} className="text-primary" />
                    <span className="font-semibold">{tipo.name}</span>
                </div>
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        isIconOnly
                        onPress={() => onEdit(tipo)}
                    >
                        <Pen2 size={16} />
                    </Button>
                    <Button
                        size="sm"
                        variant="light"
                        color="danger"
                        isIconOnly
                        onPress={() => onDelete(tipo)}
                    >
                        <TrashBin2 size={16} />
                    </Button>
                </div>
            </CardHeader>
            <CardBody>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-default-500">Abreviatura:</span>
                        <span className="text-sm">{tipo.abbreviation || "—"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-default-500">Estado:</span>
                        <Chip 
                            color={tipo.status === 'ACTIVE' ? 'success' : 'default'} 
                            size="sm"
                        >
                            {tipo.status || "Activo"}
                        </Chip>
                    </div>
                    {tipo.description && (
                        <div>
                            <span className="text-sm text-default-500">Descripción:</span>
                            <p className="text-sm mt-1">{tipo.description}</p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}