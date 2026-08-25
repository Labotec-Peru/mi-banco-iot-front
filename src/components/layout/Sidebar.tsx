import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AltArrowDown,
  UserCircle,
  ChartSquare,
  SettingsMinimalistic,
  MinusCircle,
  HamburgerMenu,
  Bell,
  Programming,
  UsersGroupRounded,
  ShieldUser,
  LockKeyhole,
  Translation,
  SpedometerMiddle,
  Widget5,
} from "@solar-icons/react";
import { Button } from "@heroui/react";
import { useSelector } from "react-redux";
import ThemeToggle from "../ux/ThemeToggle";

type SidebarItem = {
  codigo: number;
  name: string;
  path: string;
  icon: any;
  badge?: number;
  children?: SidebarItem[];
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: "Operación",
    items: [
      {
        codigo: 1,
        name: "Inicio",
        path: "/dashboard",
        icon: Widget5,       
      },
      {
        codigo: 2,
        name: "Medidores",
        path: "/medidores",
        icon: SpedometerMiddle,
        badge: 2,
      },
      {
        codigo: 3,
        name: "Sensores",
        path: "/sensores",
        icon: Translation,
      },
      {
        codigo: 4,
        name: "Lecturas",
        path: "/graph",
        icon: ChartSquare,
        badge: 4,
      },
      {
        codigo: 5,
        name: "Alertas",
        path: "/alertas",
        icon: Bell,
        badge: 4,
      },
    ],
  },  

  {
    title: "Herramientas",
    items: [
      {
        codigo: 9,
        name: "Comandos",
        path: "/command",
        icon: Programming,
      },      
    ],
  },

  {
    title: "Administración",
    items: [
      {
        codigo: 11,
        name: "Usuarios",
        path: "/usuarios",
        icon: UsersGroupRounded,
        children: [
          {
            codigo: 111,
            name: "Listado",
            path: "/usuarios",
            icon: UserCircle,
          },
          {
            codigo: 112,
            name: "Roles",
            path: "/roles",
            icon: ShieldUser,
          },
          {
            codigo: 113,
            name: "Permisos",
            path: "/permisos",
            icon: LockKeyhole,
          },
        ],
      },
      {
        codigo: 12,
        name: "Configuración",
        path: "/configuracion",
        icon: SettingsMinimalistic,
      },
    ],
  },
];

export default function Sidebar() {
  const user = useSelector((state: any) => state.auth.user);

  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded");
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setIsMobileOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen((prev) => !prev);
      return;
    }
    setIsExpanded((prev: any) => !prev);
  };

  const isItemActive = (item: SidebarItem) => {
    const currentPath = location.pathname;

    if (item.path === "/dashboard") {
      return currentPath === "/dashboard" || currentPath.startsWith("/dashboard/location");
    }
    if (item.children?.length) {
      return item.children.some((c) => currentPath.startsWith(c.path));
    }
    const cleanPath = item.path.replace("/", "");
    const singularKeyword = cleanPath.endsWith("s") ? cleanPath.slice(0, -1) : cleanPath;
    return currentPath.includes(singularKeyword);
  };

  const isChildActive = (childPath: string) => location.pathname.startsWith(childPath);

  const expanded = isExpanded || isMobile;

  return (
    <>
      {isMobile && !isMobileOpen && (
        <Button
          isIconOnly
          color="primary"
          className="fixed left-4 top-4 z-[120] md:hidden"
          onPress={toggleSidebar}
        >
          <HamburgerMenu size={27} weight="Broken" />
        </Button>
      )}

      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] bg-black/45 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {(!isMobile || isMobileOpen) && (
        <motion.aside
          initial={false}
          animate={
            isMobile
              ? { x: isMobileOpen ? 0 : -320, opacity: 1 }
              : { width: isExpanded ? 270 : 84 }
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed left-0 top-0 z-[50] h-screen bg-content1 flex flex-col shadow-xs overflow-hidden md:relative md:h-screen ${isMobile ? "w-[85vw] max-w-[300px]" : ""
            }`}
        >
          <div className={`flex items-center h-20 shrink-0 ${expanded ? "px-5 justify-between" : "justify-center"}`}>
            <div className="flex items-center overflow-hidden" onClick={toggleSidebar}>
              <img src="/icologoSVGamarillo.svg" alt="Logo" className={`${expanded ? "h-12" : "h-10"} shrink-0`} />
              <AnimatePresence>
                {expanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="font-bold text-lg text-foreground whitespace-nowrap"
                  >
                    <img
                      src="/textlogomibanco.svg"
                      alt="Logo"
                      className="h-5 -ml-4"
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>



          <nav className="flex-1 flex flex-col overflow-y-auto pb-1">
            {SIDEBAR_SECTIONS.map((section, sIdx) => (
              <div
                key={section.title}
                className={`relative ${sIdx > 0
                  ? "before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-zinc-300 before:to-transparent"
                  : ""
                  }`}
              >
                <p className="text-xs font-medium text-default-400 mb-2 mt-1 px-5 truncate dark:text-default-500">
                  {section.title}
                </p>

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const hasChildren = !!item.children?.length;
                  const active = isItemActive(item);
                  const isOpen = !!openMenus[item.codigo];
                  const showPill = hasChildren ? active && isOpen : active;

                  return (
                    <div key={item.codigo} className="flex flex-col mb-1">
                      {hasChildren ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (isMobile) setIsMobileOpen(false);
                            if (!isExpanded && !isMobile) {
                              setIsExpanded(true);
                              setTimeout(() => {
                                setOpenMenus((prev) => ({ ...prev, [item.codigo]: true }));
                              }, 250);
                              return;
                            }
                            setOpenMenus((prev) => ({ ...prev, [item.codigo]: !prev[item.codigo] }));
                          }}
                          className={`relative flex items-center h-11 transition-colors duration-200 ${expanded ? "mx-3 px-3 rounded-md" : "mx-auto w-11 justify-center rounded-full"
                            } ${showPill
                              ? "text-white dark:text-black"
                              : active
                                ? "text-foreground font-semibold"
                                : "text-default-500 hover:bg-default-100"
                            }`}
                        >
                          {showPill && (
                            <motion.div
                              layoutId="sidebar-active-pill"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              className="absolute inset-0 rounded-full bg-primary dark:bg-secondary z-0"
                            />
                          )}

                          <span className="relative z-10">
                            <Icon weight="BoldDuotone" size={20} />
                            {!expanded && item.badge ? (
                              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                            ) : null}
                          </span>

                          {expanded && (
                            <>
                              <span className="relative z-10 ml-3 flex-1 text-left text-sm font-medium">
                                {item.name}
                              </span>
                              <span className="relative z-10">
                                {showPill ? (
                                  <MinusCircle size={18} />
                                ) : (
                                  <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <AltArrowDown size={16} />
                                  </motion.div>
                                )}
                              </span>
                            </>
                          )}
                        </button>
                      ) : (
                        <NavLink
                          to={item.path}
                          onClick={() => {
                            if (isMobile) setIsMobileOpen(false);
                          }}
                          className={`relative flex items-center h-11 transition-colors duration-200 ${expanded ? "mx-3 px-3 rounded-full" : "mx-auto w-11 justify-center rounded-full"
                            } ${active ? "text-white dark:text-black" : "text-default-500 hover:bg-default-100"}`}
                        >
                          {active && (
                            <motion.div
                              layoutId="sidebar-active-pill"
                              transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              className="absolute inset-0 rounded-full bg-primary dark:bg-secondary z-0"
                            />
                          )}

                          <span className="relative z-10">
                            <Icon weight="BoldDuotone" size={20} />
                            {!expanded && item.badge ? (
                              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                            ) : null}
                          </span>

                          {expanded && (
                            <span className="relative z-10 ml-3 flex-1 text-sm font-medium ">
                              {item.name}
                            </span>
                          )}

                          {expanded && item.badge ? (
                            <span
                              className={`relative z-10 ml-2 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full text-xs font-semibold ${active ? "bg-background text-foreground" : "bg-default-100 text-default-600"
                                }`}
                            >
                              {item.badge}
                            </span>
                          ) : null}
                        </NavLink>
                      )}

                      <AnimatePresence>
                        {hasChildren && expanded && isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="relative ml-8.5 mt-1 mb-1 pl-4 border-l border-default-200 [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,black_80%,transparent_100%)]">
                              {item.children!.map((child) => {
                                const ChildIcon = child.icon;
                                const childActive = isChildActive(child.path);
                                return (
                                  <NavLink
                                    key={child.path}
                                    to={child.path}
                                    onClick={() => {
                                      if (isMobile) setIsMobileOpen(false);
                                    }}
                                    className="relative mr-3 mb-1 h-10 flex items-center gap-3 rounded-full px-3 text-sm transition-colors"
                                  >
                                    {childActive && (
                                      <motion.div
                                        layoutId="sidebar-active-child-pill"
                                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                                        className="absolute inset-0 rounded-full  shadow-sm z-0"
                                        
                                      />
                                    )}
                                    <span
                                      className={`relative z-10 flex items-center gap-3 ${childActive
                                        ? " dark:text-white text-black font-medium"
                                        : "text-default-500 hover:text-foreground"
                                        }`}
                                    >
                                      <ChildIcon size={16} />
                                      {child.name}
                                    </span>
                                  </NavLink>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>
          <ThemeToggle user={user} expanded={expanded} />
        </motion.aside>
      )}
    </>
  );
}