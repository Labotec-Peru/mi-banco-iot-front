import { Card, CardBody, CardHeader } from "@heroui/react";
import type { Lectura } from "../types/lectura";

interface ReadingsChartProps {
    readings: Lectura[];
}

export default function ReadingsChart({ readings }: ReadingsChartProps) {
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {readings.map((lectura) => (
                <Card key={lectura.id} className="w-full">
                    <CardHeader className="flex gap-3">
                        <div className="flex flex-col">
                            <p className="text-md">Medidor #{lectura.waterMeterId}</p>
                            <p className="text-small text-default-500">
                                {new Date(lectura.readingDate).toLocaleDateString()}
                            </p>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs text-default-500">Valor</p>
                                <p className="text-lg font-semibold">{lectura.value}</p>
                            </div>
                            <div>
                                <p className="text-xs text-default-500">Consumo</p>
                                <p className="text-lg font-semibold">{lectura.consumption}</p>
                            </div>
                            <div>
                                <p className="text-xs text-default-500">Estado</p>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                    lectura.status === 'ACTIVE' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {lectura.status}
                                </span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}