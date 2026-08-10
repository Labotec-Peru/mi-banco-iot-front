import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

import { Logout3, Magnifer, BellBing } from "@solar-icons/react";
import { Input } from "@heroui/react";

const routeInfoMap = [
  {
    keyword: "/dashboard/location",
    title: "Ubicación",
    subtitle: "Monitoreo geográfico y tracking del sistema",
  },
  {
    keyword: "/dashboard/device",
    title: "Detalle de Dispositivo",
    subtitle: "Consola de estado, métricas y telemetría",
  },
  {
    keyword: "/dashboard",
    title: "Inicio",
    subtitle: "Administre sus dispositivos en tiempo real",
  },
  {
    keyword: "/devices",
    title: "Dispositivos",
    subtitle: "Listado completo de terminales conectados",
  },
  {
    keyword: "/graphics",
    title: "Gráficos y Estadísticas",
    subtitle: "Visualización de datos analíticos",
  },
  {
    keyword: "/alerts",
    title: "Alertas y Notificaciones",
    subtitle: "Historial de advertencias y eventos del sistema",
  },
  {
    keyword: "/users",
    title: "Usuarios",
    subtitle: "Control de operadores y permisos de acceso",
  },
  {
    keyword: "/client",
    title: "Clientes",
    subtitle: "Gestión de cuentas y partners comerciales",
  },
  {
    keyword: "/command",
    title: "Línea de Comandos",
    subtitle: "Envío manual de payloads y scripts remotos",
  },
];

const UNREAD_ALERTS_COUNT = 3;

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: any) => state.auth.user);

  const location = useLocation();
  const pageMeta = useMemo(() => {
    const currentPath = location.pathname;
    const matchedRoute = routeInfoMap.find((route) =>
      currentPath.startsWith(route.keyword),
    );
    return (
      matchedRoute || { title: "Panel", subtitle: "Bienvenido al sistema" }
    );
  }, [location.pathname]);

  const [search, setSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/${encodeURIComponent(query)}`);
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className="w-full sticky top-0 z-40 flex items-center justify-between gap-6
      h-[72px] bg-transparent px-8 bg-background/80 backdrop-blur-md border-b border-divider border-zinc-100 dark:border-zinc-800"
    >
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex flex-1 max-w-md"
      >
        <div className="relative w-full group">         
          <Input  
            type="text"
            value={search}
            radius="full"
            size="md"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar dispositivos, clientes, comandos..."        
            startContent={<Magnifer size={18} className="text-default-400" />}   
          />
        </div>
      </form>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => navigate("/alerts")}
          aria-label="Ver alertas"
          className="relative p-2.5 rounded-full text-default-500 hover:bg-default-100 hover:text-foreground transition-colors"
        >
          <BellBing size={20} />
          {UNREAD_ALERTS_COUNT > 0 && (
            <span
              className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] px-[3px]
              flex items-center justify-center rounded-full bg-danger text-white
              text-[10px] font-semibold leading-none"
            >
              {UNREAD_ALERTS_COUNT > 9 ? "9+" : UNREAD_ALERTS_COUNT}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-divider">
          <div className="w-10 h-10 rounded-full border border-divider shadow-sm overflow-hidden shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.username || "A"}&background=0f1bca&color=fff&size=128&rounded=true&bold=true`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-sm font-semibold text-foreground leading-none">
              {user?.username || "Usuario IoT"}
            </p>
            <p className="text-xs text-default-400 mt-0.5">
              {user?.rol || "Operador"}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          aria-label="Cerrar sesión"
          className="p-2.5 rounded-full transition-colors
          bg-danger/10 text-danger hover:bg-danger/20"
        >
          <Logout3 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}