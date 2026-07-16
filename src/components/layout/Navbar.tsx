import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";

import { Logout3 } from "@solar-icons/react";

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

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-full absolute top-0 z-40">
      <header
        className="flex items-center justify-between h-[70px] px-10 py-2
        bg-[#1e187b]"
      >
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-white transition-all duration-300">
            {pageMeta.title}
          </h1>
          <p className="text-sm text-white/80 transition-all duration-300">
            {pageMeta.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pl-4 border-l border-white/20">
            <div className="w-11 h-11 rounded-full bg-[#1e187b] border border-white/30 shadow overflow-hidden">
              <img
                src={`https://ui-avatars.com/api/?name=${user?.username || "A"}&background=1e187b&color=fff&size=128&rounded=true&border=fff&bold=true`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">
                {user?.username || "Usuario IoT"}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            aria-label="Cerrar sesión"
            className="p-2.5 rounded-xl transition-all
            bg-red-500/10 text-red-500
            hover:bg-red-500/20 backdrop-blur-md"
          >
            <Logout3 className="w-5 h-5" />
          </button>
        </div>
      </header>
    </div>
  );
}
