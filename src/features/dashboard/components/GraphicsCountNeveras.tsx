// GraphicsCountNeveras.tsx
import { Card, CardBody, Skeleton } from "@heroui/react";
import { useGetDashboardContadoresQuery } from "../services/mapApi";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface PieCardProps {
  title: string;
  data: {
    name: string;
    value: number;
    color: string;
    estadoLabel: string; 
  }[];
  layout?: "grid" | "sidebar";
  onItemClick?: (estadoLabel: string) => void; 
}

interface GraphicsCountNeverasProps {
  layout?: "grid" | "sidebar";
  onFilterByEstado?: (estadoLabel: string) => void; 
}


function TotalCardSkeleton() {
  return (
    <Card shadow="none" className="bg-white/30 backdrop-blur-md p-1">
      <div className="flex justify-between items-center">
        <Skeleton className="rounded-lg w-32 h-7" />
        <div className="flex flex-col items-end gap-2">
          <Skeleton className="rounded-lg w-24 h-7" />
          <Skeleton className="rounded-lg w-40 h-4" />
        </div>
      </div>
    </Card>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="bg-white/80 border backdrop-blur-2xl border-gray-200 rounded-lg shadow-lg p-3 w-50">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: item.color }}
        />
        <span className="font-semibold">{item.name}</span>
      </div>

      <p className="text-sm text-gray-600">
        Cantidad: <span className="font-bold">{item.value}</span>
      </p>
    </div>
  );
}

function PieCardSkeleton({ layout }: { layout: "grid" | "sidebar" }) {
  return (
    <Card shadow="none" className={`h-full bg-white/30 backdrop-blur-md ${layout === "sidebar" ? "shadow-none" : "shadow-sm"}`}>
      <CardBody>
        <Skeleton className="rounded-lg w-32 h-7 mb-4" />
        
        <div className={`flex flex-col md:flex-row ${layout === "sidebar" ? "items-center" : "items-center"} gap-10`}>
          <div className={`${layout === "sidebar" ? "w-40 h-40" : "w-50 h-50"}`}>
            <Skeleton className="w-full h-full rounded-full" />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <Skeleton className="rounded-lg w-24 h-8" />
            
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-2 flex-1">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="rounded-lg flex-1 h-4" />
                </div>
                <Skeleton className="rounded-lg w-12 h-4" />
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function PieCard({ title, data, layout, onItemClick }: PieCardProps & { layout: "grid" | "sidebar" }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const handleItemClick = (estadoLabel: string) => {
    if (onItemClick && estadoLabel) {
      onItemClick(estadoLabel);
    }
  };

  return (
    <Card shadow="none" className={`h-full bg-white/30 backdrop-blur-md transition-all hover:shadow-md ${layout === "sidebar" ? "shadow-none" : "shadow-sm"}`}>
      <CardBody>
        <h3 className="text-lg font-bold mb-4">{title}</h3>

        <div className={`flex flex-col md:flex-row ${layout === "sidebar" ? "items-center" : "items-center"} gap-10`}>
          <div className={`${layout === "sidebar" ? "w-40 h-40 " : "w-50 h-50"}`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={layout === "sidebar" ? 30 : 40}
                  outerRadius={layout === "sidebar" ? 70 : 100}
                  paddingAngle={3}
                >
                  {data.map((item) => (
                    <Cell 
                      key={item.name} 
                      fill={item.color}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleItemClick(item.estadoLabel)}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <span className="text-2xl font-bold">
              {total.toLocaleString()}
            </span>

            {data.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 w-full cursor-pointer hover:bg-white/20 rounded-lg  transition-colors"
                onClick={() => handleItemClick(item.estadoLabel)}
                title={`Filtrar por ${item.name}`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                  <span className="text-sm hover:underline">{item.name}</span>
                </div>
                <span className="font-semibold">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}


export default function GraphicsCountNeveras({
  layout = "grid",
  onFilterByEstado,
}: GraphicsCountNeverasProps) {
  const { data, isLoading } = useGetDashboardContadoresQuery();

  const cardsClass =
    layout === "sidebar"
      ? "flex flex-col gap-2"
      : "grid grid-cols-1 lg:grid-cols-3 gap-10";

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 animate-pulse">
        <TotalCardSkeleton />
        <div className={cardsClass}>
          <PieCardSkeleton layout={layout} />
          <PieCardSkeleton layout={layout} />
          <PieCardSkeleton layout={layout} />
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  const dashboard = data.data;

  const total =
    dashboard.operativo_CARTERA +
    dashboard.operativo_CENSO +
    dashboard.operativo_INSTALACION +
    dashboard.fuera_DE_ZONA +
    dashboard.desconexion_DE_ENERGIA +
    dashboard.taller +
    dashboard.distribuidor +
    dashboard.mtto +
    dashboard.traslado +
    dashboard.nestle +
    dashboard.fuera_DE_LINEA;

  const operativas = [
    {
      name: "Operativo Cartera",
      value: dashboard.operativo_CARTERA,
      color: "#003595",
      estadoLabel: "Operativo - Cartera", // Label para el filtro
    },
    {
      name: "Operativo Censo",
      value: dashboard.operativo_CENSO,
      color: "#4E95D9",
      estadoLabel: "Operativo - Censo",
    },
    {
      name: "Operativo Instalación",
      value: dashboard.operativo_INSTALACION,
      color: "#00A5E8",
      estadoLabel: "Operativo - Instalación",
    },
  ];

  const alertadas = [
    {
      name: "Fuera de Zona",
      value: dashboard.fuera_DE_ZONA,
      color: "#F28B00",
      estadoLabel: "Fuera de Zona",
    },
    {
      name: "Sin Energía",
      value: dashboard.desconexion_DE_ENERGIA,
      color: "#FFD200",
      estadoLabel: "Desconexión por Energía",
    },
    {
      name: "Movimiento",
      value: dashboard.movimiento_FUERA_DE_ZONA,
      color: "#FF5F1F",
      estadoLabel: "Movimiento Fuera de Zona", // Ajusta según tu mapeo
    },
    {
      name: "Detenido",
      value: dashboard.detenido_FUERA_DE_ZONA,
      color: "#C2410C",
      estadoLabel: "Detenido Fuera de Zona", // Ajusta según tu mapeo
    },
  ];

  const otros = [
    {
      name: "Taller",
      value: dashboard.taller,
      color: "#000000",
      estadoLabel: "Taller",
    },
    {
      name: "Distribuidor",
      value: dashboard.distribuidor,
      color: "#4B5563",
      estadoLabel: "Distribuidor",
    },
    {
      name: "Mantenimiento",
      value: dashboard.mtto,
      color: "#9CA3AF",
      estadoLabel: "Mantenimiento", // Ajusta según tu mapeo
    },
    {
      name: "Traslado",
      value: dashboard.traslado,
      color: "#D1D5DB",
      estadoLabel: "Traslado", // Ajusta según tu mapeo
    },
    {
      name: "Fuera de Línea",
      value: dashboard.fuera_DE_LINEA,
      color: "#6B7280",
      estadoLabel: "Fuera de Línea",
    },
    {
      name: "Nestlé",
      value: dashboard.nestle,
      color: "#E5E7EB",
      estadoLabel: "Nestlé", // Ajusta según tu mapeo
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <Card shadow="none" className="bg-white/30 backdrop-blur-md p-1">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Total de Neveras</h3>

          <div className="flex flex-col items-end">
            <span className="text-xl font-bold">
              {total.toLocaleString()}
            </span>

            <span className="text-xs text-gray-500">
              Última actualización:{" "}
              {new Date(dashboard.registro_CORTE).toLocaleString()}
            </span>
          </div>
        </div>
      </Card>

      <div className={cardsClass}>
        <PieCard 
          title="Operativas" 
          data={operativas} 
          layout={layout}
          onItemClick={onFilterByEstado}
        />
        <PieCard 
          title="Alertadas" 
          data={alertadas} 
          layout={layout}
          onItemClick={onFilterByEstado}
        />
        <PieCard 
          title="En Traslado / Otros" 
          data={otros} 
          layout={layout}
          onItemClick={onFilterByEstado}
        />
      </div>
    </div>
  );
}