import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useTheme } from "../../hooks/useTheme";
import {
  MoonStars,
  Sun2,
  AltArrowDown,
  UserCircle,
  SettingsMinimalistic,
  Logout3,
} from "@solar-icons/react";
import { logout } from "../../features/auth/authSlice";

type ThemeToggleProps = {
  user?: {
    username?: string;
    tienda?: string;
    ubicacion?: string;
    avatarUrl?: string;
    [key: string]: any;
  };
  expanded: boolean;
};

const ThemeToggle = ({ user, expanded }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const avatarSrc =
    user?.avatarUrl ??
    `https://ui-avatars.com/api/?name=${user?.username || "U"}&background=0f1bca&color=fff&size=128&rounded=true&bold=true`;

  return (
    <div className={`shrink-0 ${expanded ? "px-5" : "px-3"} pb-4`}>
      <Dropdown backdrop="opaque"  placement={expanded ? "bottom-start" : "right-start"} > 
        <DropdownTrigger>
          <Button
            size="lg"
            isIconOnly={!expanded}
            variant="flat"
            className={`w-full flex items-center gap-3 rounded-full   bg-background hover:bg-default-100 transition-colors ${
              expanded ? "px-2 py-2.5" : "justify-center p-2"
            }`}
          >
            <Avatar isBordered radius="full" src={avatarSrc} />

            {expanded && (
              <>
                <div className="flex-1 text-left overflow-hidden">
                  <p className="text-sm font-semibold text-foreground truncate">
                   Username: {user?.username ?? "Usuario"}
                  </p>
                  <p className="text-xs text-default-400 truncate">
                    {user?.ubicacion ?? user?.tienda ?? "Mi tienda"}
                  </p>
                </div>
                <AltArrowDown size={16} className="text-default-400 shrink-0" />
              </>
            )}
          </Button>
        </DropdownTrigger>

        <DropdownMenu aria-label="Menú de usuario">
          <DropdownItem key="profile" startContent={<UserCircle size={18} />}>
            Mi perfil
          </DropdownItem>
          <DropdownItem
            key="settings"
            startContent={<SettingsMinimalistic size={18} />}
            onPress={() => navigate("/settings")}
          >
            Configuración
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            className="text-danger"
            startContent={<Logout3 size={18} />}
            onPress={handleSignOut}
          >
            Cerrar sesión
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {expanded ? (
        <div className="mt-3 relative flex items-center rounded-full  bg-default-100/70 p-1">
          <button
            onClick={() => theme !== "light" && toggleTheme()}
            className="relative flex-1 h-9 rounded-full text-sm font-medium transition-colors z-10"
          >
            {theme === "light" && (
              <motion.div
                layoutId="theme-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-background shadow-sm z-0"
              />
            )}
            <span
              className={`relative z-10 flex items-center justify-center gap-2 ${
                theme === "light" ? "text-foreground" : "text-default-400"
              }`}
            >
              <Sun2 size={16} weight="BoldDuotone"  className={theme === "light" ? "text-primary" : ""} />
              Light
            </span>
          </button>

          <button
            onClick={() => theme !== "dark" && toggleTheme()}
            className="relative flex-1 h-9 rounded-full text-sm font-medium transition-colors z-10"
          >
            {theme === "dark" && (
              <motion.div
                layoutId="theme-pill"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 rounded-full bg-background shadow-sm z-0"
              />
            )}
            <span
              className={`relative z-10 flex items-center justify-center gap-2 ${
                theme === "dark" ? "text-foreground" : "text-default-400"
              }`}
            >
              <MoonStars size={16} weight="BoldDuotone" className={theme === "dark" ? "text-secondary" : ""} />
              Dark
            </span>
          </button>
        </div>
      ) : (
        <button
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          className="mt-3 mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-divider border-primary dark:border-secondary bg-default-100/70 hover:bg-default-100 transition-colors"
        >
          {theme === "dark" ? (
            <Sun2 size={16} className="text-secondary" weight="BoldDuotone" />
          ) : (
            <MoonStars size={16} className="text-primary" weight="BoldDuotone"/>
          )}
        </button>
      )}
    </div>
  );
};

export default ThemeToggle;