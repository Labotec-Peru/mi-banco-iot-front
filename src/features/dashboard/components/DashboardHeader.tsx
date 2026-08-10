import { Button } from "@heroui/react";
import { Logout3 } from "@solar-icons/react";
import { logout } from "../../auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AnimatedSearch from "../../../components/ux/AnimatedSearch";
import { useState } from "react";

import NotificationsPanel from "../../../components/ux/NotificationsPanel";

type DashboardHeaderProps = {
  userName?: string;
  subtitle?: string;
};

export default function DashboardHeader({
  userName = "Usuario",
  subtitle = "Resumen de tu actividad reciente",
}: DashboardHeaderProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    cod_nevera: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const onApply = () => {
    console.log("Aplicando filtros:", filters);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-xl font-bold text-foreground">
          Bienvenido, {userName}!
        </h1>

        <p className="mt-1 text-sm text-default-400">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsPanel />

        <AnimatedSearch
          onSearch={(value) => {
            setFilters({
              ...filters,
              cod_nevera: value,
            });

            onApply();
          }}
          isLoading={isLoading}
          placeholder="Buscar dispositivo"
        />

        <Button
          isIconOnly
          onPress={handleSignOut}
          aria-label="Cerrar sesión"
          className="
            h-10
            w-10
            min-w-10
            rounded-full
            bg-red-50
            text-default-500
            transition-colors
            hover:bg-danger-100
            dark:bg-danger/10
            dark:hover:bg-danger/20
          "
        >
          <Logout3
            weight="BoldDuotone"
            size={20}
            className="text-danger"
          />
        </Button>
      </div>
    </div>
  );
}