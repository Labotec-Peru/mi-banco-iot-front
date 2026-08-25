import React, { useState } from 'react';
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
    ReferenceArea,
} from 'recharts';
import { Card, CardBody, Button, Tabs, Tab, Chip } from '@heroui/react';
import {
    Refresh,
    ArrowUp,
    Water,
    Database,
    SortHorizontal,
} from '@solar-icons/react';

const hourlyData = [
    { time: '00:00', flujo: 2.1, volumen: 126, promedio: 1.8, fuga: false },
    { time: '01:00', flujo: 2.3, volumen: 138, promedio: 1.8, fuga: false },
    { time: '02:00', flujo: 2.5, volumen: 150, promedio: 1.8, fuga: false },
    { time: '03:00', flujo: 2.8, volumen: 168, promedio: 1.8, fuga: false },
    { time: '04:00', flujo: 2.6, volumen: 156, promedio: 1.8, fuga: false },
    { time: '05:00', flujo: 2.2, volumen: 132, promedio: 1.8, fuga: false },
    { time: '06:00', flujo: 3.5, volumen: 210, promedio: 2.5, fuga: false },
    { time: '07:00', flujo: 5.8, volumen: 348, promedio: 4.2, fuga: false },
    { time: '08:00', flujo: 8.2, volumen: 492, promedio: 6.5, fuga: false },
    { time: '09:00', flujo: 12.5, volumen: 750, promedio: 9.8, fuga: false },
    { time: '10:00', flujo: 15.3, volumen: 918, promedio: 12.0, fuga: false },
    { time: '11:00', flujo: 18.7, volumen: 1122, promedio: 14.5, fuga: false },
    { time: '12:00', flujo: 22.1, volumen: 1326, promedio: 16.8, fuga: false },
    { time: '13:00', flujo: 20.4, volumen: 1224, promedio: 15.2, fuga: false },
    { time: '14:00', flujo: 19.8, volumen: 1188, promedio: 14.9, fuga: false },
    { time: '15:00', flujo: 18.2, volumen: 1092, promedio: 13.5, fuga: false },
    { time: '16:00', flujo: 16.7, volumen: 1002, promedio: 12.8, fuga: false },
    { time: '17:00', flujo: 14.3, volumen: 858, promedio: 11.2, fuga: false },
    { time: '18:00', flujo: 11.8, volumen: 708, promedio: 9.5, fuga: false },
    { time: '19:00', flujo: 8.9, volumen: 534, promedio: 7.2, fuga: false },
    { time: '20:00', flujo: 6.5, volumen: 390, promedio: 5.8, fuga: false },
    { time: '21:00', flujo: 4.2, volumen: 252, promedio: 3.5, fuga: false },
    { time: '22:00', flujo: 3.1, volumen: 186, promedio: 2.2, fuga: false },
    { time: '23:00', flujo: 2.4, volumen: 144, promedio: 1.9, fuga: false },
];

const weeklyData = [
    { time: 'Lun', flujo: 45.2, volumen: 2712, promedio: 42.5 },
    { time: 'Mar', flujo: 48.7, volumen: 2922, promedio: 43.8 },
    { time: 'Mié', flujo: 52.3, volumen: 3138, promedio: 45.2 },
    { time: 'Jue', flujo: 49.8, volumen: 2988, promedio: 46.1 },
    { time: 'Vie', flujo: 55.4, volumen: 3324, promedio: 47.3 },
    { time: 'Sáb', flujo: 38.6, volumen: 2316, promedio: 35.2 },
    { time: 'Dom', flujo: 32.1, volumen: 1926, promedio: 30.8 },
];

const monthlyData = Array.from({ length: 30 }, (_, i) => ({
    time: `Día ${i + 1}`,
    flujo: Math.random() * 60 + 30,
    volumen: Math.random() * 3600 + 1800,
    promedio: 45,
}));

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-default-100 p-3 rounded-lg shadow-lg  min-w-[200px]">
                <p className="text-sm font-bold mb-2">{label}</p>

                {payload.find((p: any) => p.dataKey === 'flujo') && (
                    <div className="flex items-center justify-between gap-4 text-xs mb-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-default-600">Flujo:</span>
                        </div>
                        <span className="font-semibold">
                            {payload.find((p: any) => p.dataKey === 'flujo').value.toFixed(1)} L/min
                        </span>
                    </div>
                )}

                {payload.find((p: any) => p.dataKey === 'volumen') && (
                    <div className="flex items-center justify-between gap-4 text-xs mb-1">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-secondary" />
                            <span className="text-default-600">Volumen:</span>
                        </div>
                        <span className="font-semibold">
                            {payload.find((p: any) => p.dataKey === 'volumen').value.toFixed(0)} L
                        </span>
                    </div>
                )}

                {payload.find((p: any) => p.dataKey === 'promedio') && (
                    <div className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-default-400" />
                            <span className="text-default-600">Promedio:</span>
                        </div>
                        <span className="font-semibold">
                            {payload.find((p: any) => p.dataKey === 'promedio').value.toFixed(1)} L/min
                        </span>
                    </div>
                )}

                {payload[0]?.payload?.fuga && (
                    <div className="mt-2 pt-2 border-t border-default-200">
                        <span className="text-xs text-danger font-semibold">⚠️ Posible fuga detectada</span>
                    </div>
                )}
            </div>
        );
    }
    return null;
};

export default function FlowVolumeChart() {
    const [period, setPeriod] = useState('24h');
    const [metric, setMetric] = useState<'flujo' | 'volumen' | 'ambos'>('ambos');
    const [brushIndex, setBrushIndex] = useState<[number, number] | null>(null);

    const getChartData = () => {
        switch (period) {
            case '24h':
                return hourlyData;
            case '7d':
                return weeklyData;
            case '30d':
                return monthlyData;
            default:
                return hourlyData;
        }
    };

    const data = getChartData();

    const handleReset = () => {
        setBrushIndex(null);
    };

    return (
        <Card shadow="none" className="0">
            <CardBody className="p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                Flujo y Volumen de Consumo
                            </h3>
                            <p className="text-xs text-default-500">
                                {period === '24h' ? 'Últimas 24 horas' : period === '7d' ? 'Última semana' : 'Último mes'}
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
                                startContent={<Water size={18}  weight="Bold" />}
                            >
                                Flujo
                            </Button>
                            <Button
                                size="sm"
                                variant={metric === 'volumen' ? 'solid' : 'flat'}
                                color={metric === 'volumen' ? 'secondary' : 'default'}
                                onPress={() => setMetric('volumen')}
                                className="text-xs"
                                startContent={<Database size={18} weight="Bold" />}
                            >
                                Volumen
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                    </div>
                </div>

                <div className="h-96 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorFlujo" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00A64F" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00A64F" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorVolumen" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FFD100" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#FFD100" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e5e7eb"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="time"
                                tick={{ fontSize: 10, fill: '#6b7280' }}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />

                            <YAxis
                                yAxisId="left"
                                tick={{ fontSize: 10, fill: '#00A64F' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                label={{
                                    value: 'Flujo (L/min)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fontSize: 10,
                                    fill: '#00A64F',
                                    offset: 20
                                }}
                            />

                            {metric !== 'flujo' && (
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: 10, fill: '#FFD100' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}L`}
                                    label={{
                                        value: 'Volumen (L)',
                                        angle: 90,
                                        position: 'insideRight',
                                        fontSize: 10,
                                        fill: '#FFD100',
                                        offset: 20
                                    }}
                                />
                            )}

                            <Tooltip content={<CustomTooltip />} />

                            {metric !== 'volumen' && (
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="flujo"
                                    fill="url(#colorFlujo)"
                                    stroke="none"
                                    fillOpacity={1}
                                />
                            )}

                            {metric !== 'flujo' && (
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="volumen"
                                    fill="url(#colorVolumen)"
                                    stroke="none"
                                    fillOpacity={0.5}
                                />
                            )}

                            {metric !== 'volumen' && (
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="flujo"
                                    stroke="#00A64F"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#00A64F', stroke: '#fff', strokeWidth: 2 }}
                                />
                            )}

                            {metric !== 'flujo' && (
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="volumen"
                                    stroke="#FFD100"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#FFD100', stroke: '#fff', strokeWidth: 2 }}
                                />
                            )}

                            {metric !== 'volumen' && (
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="promedio"
                                    stroke="#9CA3AF"
                                    strokeWidth={1}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            )}


                            {metric !== 'volumen' && (
                                <ReferenceLine
                                    yAxisId="left"
                                    y={20}
                                    stroke="#ef4444"
                                    strokeDasharray="3 3"
                                    strokeWidth={1}
                                />
                            )}
                            <Brush
                                dataKey="time"
                                height={25}
                                stroke="#00A64F"
                                fill="#f3f4f6"
                                travellerWidth={6}
                                startIndex={brushIndex?.[0] || 0}
                                endIndex={brushIndex?.[1] || data.length - 1}
                                onChange={(e: any) => {
                                    if (e.startIndex !== undefined && e.endIndex !== undefined) {
                                        setBrushIndex([e.startIndex, e.endIndex]);
                                    }
                                }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs flex-wrap">
                    {metric !== 'volumen' && (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-1 bg-primary rounded-full" />
                                <span className="text-default-600">Flujo actual</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-1 bg-default-400 rounded-full" />
                                <span className="text-default-600">Promedio</span>
                            </div>
                        </>
                    )}
                    {metric !== 'flujo' && (
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-1 bg-secondary rounded-full" />
                            <span className="text-default-600">Volumen</span>
                        </div>
                    )}
                    {period === '24h' && metric !== 'volumen' && (
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-1 bg-danger/50 rounded-full" />
                            <span className="text-default-600">Zona de fuga</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-default-200 dark:border-default-700">
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Flujo máx</p>
                        <p className="text-sm font-bold flex items-center justify-center gap-1">
                            <ArrowUp className="w-3 h-3 text-danger" weight="Bold" />
                            22.1
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Flujo prom</p>
                        <p className="text-sm font-bold">9.8 L/min</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Volumen total</p>
                        <p className="text-sm font-bold">245.3 m³</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-default-500">Eficiencia</p>
                        <Chip color="success" size="sm" variant="flat">92%</Chip>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}