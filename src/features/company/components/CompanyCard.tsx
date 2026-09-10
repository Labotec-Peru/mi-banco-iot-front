import { Card, CardBody, CardHeader, Button, Divider, Chip } from "@heroui/react";
import { PenNewSquare, TrashBinTrash, Calendar, Buildings2, Letter, Phone, Map } from "@solar-icons/react";
import type { Company } from "../types/company";

interface CompanyCardProps {
    company: Company;
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

export default function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
    const statusColors = {
        ACTIVE: "success",
        INACTIVE: "default",
        DELETED: "danger",
    } as const;

    const statusLabels = {
        ACTIVE: "Activo",
        INACTIVE: "Inactivo",
        DELETED: "Eliminado",
    } as const;

    return (
        <Card className="w-full hover:shadow-lg transition-all duration-300 border border-default-200 dark:border-default-100">
            <CardHeader className="flex justify-between items-start gap-2 pb-2">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Buildings2 size={20} className="text-primary" />
                        <h3 className="text-lg font-semibold">{company.name}</h3>
                    </div>
                    <p className="text-xs text-default-400 mt-1">
                        ID: #{company.id} • UUID: {company.uuid}
                    </p>
                </div>
                <div className="flex gap-1">
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() => onEdit(company)}
                        className="hover:bg-primary/10"
                    >
                        <PenNewSquare size={16} />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => onDelete(company)}
                        className="hover:bg-danger/10"
                    >
                        <TrashBinTrash size={16} />
                    </Button>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="gap-2 pt-3">
                {company.description && (
                    <p className="text-sm text-default-600 line-clamp-2">
                        {company.description}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-2 mt-2">
                    {company.email && (
                        <div className="flex items-center gap-2 text-xs text-default-600">
                            <Letter size={14} className="text-default-400" />
                            <span>{company.email}</span>
                        </div>
                    )}
                    {company.phone && (
                        <div className="flex items-center gap-2 text-xs text-default-600">
                            <Phone size={14} className="text-default-400" />
                            <span>{company.phone}</span>
                        </div>
                    )}
                    {company.address && (
                        <div className="flex items-center gap-2 text-xs text-default-600 col-span-2">
                            <Map size={14} className="text-default-400" />
                            <span className="line-clamp-1">{company.address}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-default-100">
                    <Chip
                        size="sm"
                        variant="flat"
                        color={statusColors[company.status as keyof typeof statusColors] || "default"}
                    >
                        {statusLabels[company.status as keyof typeof statusLabels] || company.status}
                    </Chip>
                    {company.created && (
                        <div className="flex items-center gap-2 text-xs text-default-400">
                            <Calendar size={14} />
                            <span>
                                Creado: {new Date(company.created).toLocaleDateString("es-PE", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}