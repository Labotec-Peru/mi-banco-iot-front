import { useState } from "react";
import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Brush,
    ReferenceLine,
} from "recharts";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import {
    ArrowUp,
    Water,
    SortHorizontal,
} from "@solar-icons/react";
import type { ChartDataPoint } from "@/features/graph/types/readingApi";

interface FlowVolumeChartProps {
    data?: ChartDataPoint[];
    title?: string;
}
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const getValue = (key: string): number | null => {
        const item = payload.find((p: any) => p.dataKey === key);
        const val = item?.value;
        return typeof val === "number" && !isNaN(val) ? val : null;
    };

    const flujo = getValue("flujo");
    const volumen = getValue("volumen");
    const promedio = getValue("promedio");

    const raw = payload[0]?.payload?.fullDate ?? label;
    const dateLabel = String(raw)
        .replace("T", " ")
        .replace("Z", "")
        .slice(0, 16);

    return (
        <div className="bg-white dark:bg-default-100 p-3 rounded-lg shadow-lg min-w-[200px]">
            <p className="text-sm font-bold mb-2">{dateLabel}</p>

            {flujo !== null && (
                <div className="flex items-center justify-between gap-4 text-xs mb-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-default-600">Flujo:</span>
                    </div>
                    <span className="font-semibold">{flujo.toFixed(2)}</span>
                </div>
            )}

            {volumen !== null && (
                <div className="flex items-center justify-between gap-4 text-xs mb-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-default-600">Volumen:</span>
                    </div>
                    <span className="font-semibold">{volumen.toFixed(3)}</span>
                </div>
            )}

            {promedio !== null && (
                <div className="flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-default-400" />
                        <span className="text-default-600">Promedio:</span>
                    </div>
                    <span className="font-semibold">{promedio.toFixed(2)}</span>
                </div>
            )}
        </div>
    );
};

export default function FlowVolumeChart({
    data = [],
    title = "Flujo y Volumen de Consumo",
}: FlowVolumeChartProps) {
    const [metric, setMetric] = useState<'flujo' | 'volumen' | 'ambos'>('ambos');
    const stats = {
        flujoMax: data.length > 0 ? Math.max(...data.map(d => d.flujo)) : 0,
        flujoProm: data.length > 0
            ? data.reduce((sum, d) => sum + d.flujo, 0) / data.length
            : 0,
        volumenTotal: data.length > 1
            ? data[data.length - 1].volumen - data[0].volumen
            : 0,
    };

    const renderChart = (type: 'flujo' | 'volumen') => {
        const isFlujo = type === 'flujo';
        const color = isFlujo ? '#00A64F' : '#FFD100';
        const dataKey = isFlujo ? 'flujo' : 'volumen';
        const label = isFlujo ? 'Flujo' : 'Volumen (m³)';
        const yAxisId = 'main';

        if (data.length === 0) {
            return (
                <div className="h-64 w-full flex items-center justify-center text-default-400 text-sm">
                    No hay datos disponibles para mostrar
                </div>
            );
        }

        return (
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id={`color${isFlujo ? 'Flujo' : 'Volumen'}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 9, fill: '#6b7280' }}
                            tickLine={false}
                            axisLine={false}
                            interval="preserveStartEnd"
                            minTickGap={60}
                            tickFormatter={(value) => {
                                const match = String(value).match(/T(\d{2}:\d{2})/);
                                return match ? match[1] : String(value);
                            }}
                        />

                        <YAxis
                            yAxisId={yAxisId}
                            tick={{ fontSize: 10, fill: color }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const s = String(value);
                                const match = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/);
                                return match ? `${match[3]}/${match[2]} ${match[4]}` : s;
                            }}
                            label={{
                                value: label,
                                angle: -90,
                                position: 'insideLeft',
                                fontSize: 10,
                                fill: color,
                                offset: 20
                            }}
                        />

                        <Tooltip content={<CustomTooltip />} />

                        <Area
                            yAxisId={yAxisId}
                            type="monotone"
                            dataKey={dataKey}
                            fill={`url(#color${isFlujo ? 'Flujo' : 'Volumen'})`}
                            stroke="none"
                            fillOpacity={1}
                        />

                        <Line
                            yAxisId={yAxisId}
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
                        />

                        {isFlujo && data.length > 0 && (
                            <Line
                                yAxisId={yAxisId}
                                type="monotone"
                                dataKey="promedio"
                                stroke="#9CA3AF"
                                strokeWidth={1}
                                strokeDasharray="5 5"
                                dot={false}
                            />
                        )}

                        {isFlujo && (
                            <ReferenceLine
                                yAxisId={yAxisId}
                                y={stats.flujoMax * 0.8}
                                stroke="#ef4444"
                                strokeDasharray="3 3"
                                strokeWidth={1}
                            />
                        )}

                        <Brush
                            dataKey="time"
                            height={20}
                            stroke={color}
                            fill="#f3f4f6"
                            travellerWidth={6}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <Card shadow="none">
            <CardBody className="p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                {title}
                            </h3>
                            <p className="text-xs text-default-500">
                                {data.length > 0
                                    ? `${data.length} lecturas disponibles`
                                    : 'Sin datos'}
                            </p>
                        </div>

                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                variant={metric === 'ambos' ? 'solid' : 'flat'}
                                color={metric === 'ambos' ? 'primary' : 'default'}
                                onPress={() => setMetric('ambos')}
                                className="text-xs"
                                startContent={<SortHorizontal size={18} weight="Bold" />}
                            >
                                Ambos
                            </Button>
                            <Button
                                size="sm"
                                variant={metric === 'flujo' ? 'solid' : 'flat'}
                                color={metric === 'flujo' ? 'primary' : 'default'}
                                onPress={() => setMetric('flujo')}
                                className="text-xs"
                                startContent={<Water size={18} weight="Bold" />}
                            >
                                Flujo
                            </Button>
                            <Button
                                size="sm"
                                variant={metric === 'volumen' ? 'solid' : 'flat'}
                                color={metric === 'volumen' ? 'secondary' : 'default'}
                                onPress={() => setMetric('volumen')}
                                className="text-xs"
                                startContent={<ArrowUp className="w-3 h-3" weight="Bold" />}
                            >
                                Volumen
                            </Button>
                        </div>
                    </div>
                </div>

                {(metric === 'ambos' || metric === 'flujo') && (
                    <div className="mt-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-[#00A64F]" />
                            <span className="text-xs font-semibold">Flujo</span>
                        </div>
                        {renderChart('flujo')}
                    </div>
                )}

                {(metric === 'ambos' || metric === 'volumen') && (
                    <div className="mt-6 pt-4 border-t border-default-200 dark:border-default-700">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-[#FFD100]" />
                            <span className="text-xs font-semibold">Volumen</span>
                        </div>
                        {renderChart('volumen')}
                    </div>
                )}

                <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-default-200 dark:border-default-700">
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Flujo máx</p>
                        <p className="text-sm font-bold flex items-center justify-center gap-1">
                            <ArrowUp className="w-3 h-3 text-danger" weight="Bold" />
                            {stats.flujoMax.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Flujo prom</p>
                        <p className="text-sm font-bold">{stats.flujoProm.toFixed(2)} mL/h</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Volumen total</p>
                        <p className="text-sm font-bold">{stats.volumenTotal.toFixed(2)} mL</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Lecturas</p>
                        <Chip color="primary" size="sm" variant="flat">
                            {data.length}
                        </Chip>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}