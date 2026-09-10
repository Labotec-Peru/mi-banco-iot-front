import { Card, CardBody, CardHeader, Button, Divider } from "@heroui/react";
import { Pen2, TrashBin2, Calendar } from "@solar-icons/react";
import type { Marca } from "../types/marca";

interface MarcaCardProps {
    marca: Marca;
    onEdit: (marca: Marca) => void;
    onDelete: (marca: Marca) => void;
}

export default function MarcaCard({ marca, onEdit, onDelete }: MarcaCardProps) {
    return (
        <Card className="w-full hover:shadow-md transition-shadow">
            <CardHeader className="flex justify-between items-start gap-2">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{marca.name}</h3>
                    <p className="text-sm text-default-500">
                        ID: {marca.id}
                    </p>
                </div>
                <div className="flex gap-1">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => onEdit(marca)}
                    >
                        <Pen2 size={16} />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => onDelete(marca)}
                    >
                        <TrashBin2 size={16} />
                    </Button>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="gap-2">
                {marca.description ? (
                    <p className="text-sm text-default-600">{marca.description}</p>
                ) : (
                    <p className="text-sm text-default-400 italic">Sin descripción</p>
                )}
                {marca.createdAt && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-default-400">
                        <Calendar size={14} />
                        <span>
                            Creado: {new Date(marca.createdAt).toLocaleDateString('es-ES', {
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