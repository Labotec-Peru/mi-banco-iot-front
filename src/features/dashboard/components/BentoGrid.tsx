import Panel from "./Panel";
import GraphicsPanel from "./GraphicsPanel";
import DeviceListPanel from "./Deviceinfopanel";
import NeverasMapa from "./NeverasMapa";

const devices = [
  {
    id: "DEV-00125",
    location: "Planta 2 - Sector B",
    alertLevel: "critical" as const,
    alertMessage: "Pérdida de energía",
    status: "active" as const,
  },
  {
    id: "DEV-00482",
    location: "Planta 1 - Sector A",
    alertLevel: "critical" as const,
    alertMessage: "Temperatura crítica",
    status: "active" as const,
  },
  {
    id: "DEV-00821",
    location: "Planta 2 - Sector C",
    alertLevel: "warning" as const,
    alertMessage: "Batería baja",
    status: "active" as const,
  },
  {
    id: "DEV-00214",
    location: "Planta 3 - Sector A",
    alertLevel: "warning" as const,
    alertMessage: "Desconexión intermitente",
    status: "active" as const,
  },
  {
    id: "DEV-00631",
    location: "Planta 1 - Sector B",
    alertLevel: "none" as const,
    status: "active" as const,
  },
  {
    id: "DEV-00915",
    location: "Planta 3 - Sector C",
    alertLevel: "none" as const,
    status: "active" as const,
  },
  {
    id: "DEV-00372",
    location: "Planta 2 - Sector A",
    alertLevel: "critical" as const,
    alertMessage: "Puerta abierta",
    status: "inactive" as const,
  },
];

export default function BentoGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 py-2 items-stretch">
      <div className="lg:col-span-2 lg:row-span-1">
        <Panel title="Ubicación del dispositivo" className="h-full">
          <NeverasMapa />
        </Panel>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-1">        
        <Panel title="Dispositivos" subtitle="Con alertas activas">
         <DeviceListPanel
            devices={devices}
            onSelectDevice={(id: string) =>
              console.log("Ver dispositivo", id)
            }
          />
        </Panel>
        <Panel title="Estado de Dispositivo">
          <GraphicsPanel />
        </Panel>
      </div>
    </div>
  );
}