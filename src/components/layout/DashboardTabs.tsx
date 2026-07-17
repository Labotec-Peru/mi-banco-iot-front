import { Tab, Tabs } from "@heroui/react";
import { PlugCircle, ServerMinimalistic, StreetsMapPoint } from "@solar-icons/react";
import { useLocation, useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import { useState, type ComponentType, type ReactNode } from "react";

const DraggableTabs = Draggable as unknown as ComponentType<{
  children: ReactNode;
  position: { x: number; y: number };
  onStop: (event: MouseEvent, data: { x: number; y: number }) => void;
}>;

export default function DashboardTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const currentTab = (() => {
    if (location.pathname === "/dashboard") return "mapa";
    if (location.pathname === "/dashboard/neveras") return "congeladoras";
    if (location.pathname === "/dashboard/jasper") return "jasper";
    return "mapa";
  })(); 
  return (
    <DraggableTabs
      position={position}
      onStop={(_, data) => {
        setPosition({ x: data.x, y: data.y });
        localStorage.setItem("tabsPosition", JSON.stringify({
          x: data.x,
          y: data.y,
        }));
      }}
    >
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20 px-2 py-2">
          <Tabs
            selectedKey={currentTab}
            onSelectionChange={(key) => {
              switch (key) {
                case "mapa":
                  navigate("/dashboard");
                  break;
                case "congeladoras":
                  navigate("/dashboard/neveras");
                  break;
                case "jasper":
                  navigate("/dashboard/jasper");
                  break;
              }
            }}
            color="primary"
            variant="solid"
          >
            <Tab
              key="mapa"
              title={
                <div className="flex items-center gap-2">
                  <StreetsMapPoint size={18} />
                  <span>Mapa</span>
                </div>
              }
            />

            <Tab
              key="congeladoras"
              title={
                <div className="flex items-center gap-2">
                  <ServerMinimalistic size={18} />
                  <span>Congeladoras</span>
                </div>
              }
            />

            <Tab
              key="jasper"
              title={
                <div className="flex items-center gap-2">
                  <PlugCircle size={18} />
                  <span>Jasper</span>
                </div>
              }
            />
          </Tabs>
        </div>
      </div>
    </DraggableTabs>
  );
}