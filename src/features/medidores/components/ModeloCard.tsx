import { Card, CardBody, CardHeader, Button, Divider } from "@heroui/react";
import { Pen2, TrashBin2, Calendar } from "@solar-icons/react";
import type { Modelo } from "../types/modelo";

interface ModeloCardProps {
    modelo: Modelo;
    onEdit: (modelo: Modelo) => void;
    onDelete: (modelo: Modelo) => void;
}

export default function ModeloCard({ modelo, onEdit, onDelete }: ModeloCardProps) {
    return (
        <Card className="w-full hover:shadow-md transition-shadow">
            <CardHeader className="flex justify-between items-start gap-2">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{modelo.name}</h3>
                    <p className="text-sm text-default-500">
                        ID: {modelo.id}
                    </p>
                </div>
                <div className="flex gap-1">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => onEdit(modelo)}
                    >
                        <Pen2 size={16} />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => onDelete(modelo)}
                    >
                        <TrashBin2 size={16} />
                    </Button>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="gap-2">
                {modelo.description ? (
                    <p className="text-sm text-default-600">{modelo.description}</p>
                ) : (
                    <p className="text-sm text-default-400 italic">Sin descripción</p>
                )}
                {modelo.createdAt && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-default-400">
                        <Calendar size={14} />
                        <span>
                            Creado: {new Date(modelo.createdAt).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                )}
            </CardBody>
        </Card>
    );
}