import { useMemo, useState } from "react";
import {
    Badge,
    Button,
    Chip,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    useDisclosure,
} from "@heroui/react";

import {
    Bell,
    Danger,
    CheckCircle,
    InfoCircle,
    CloseCircle,
    AltArrowRight,
    CheckRead,
    ClockCircle,
    FlashDrive,
} from "@solar-icons/react";

type AlertType = "critical" | "warning" | "info";

type Notification = {
    id: number;
    type: AlertType;
    title: string;
    description: string;
    device: string;
    time: string;
    read: boolean;
};

type FilterType = "all" | AlertType;

const initialNotifications: Notification[] = [
    {
        id: 1,
        type: "critical",
        title: "Pérdida de energía",
        description: "La nevera dejó de recibir alimentación eléctrica.",
        device: "NEV-00125",
        time: "Hace 2 min",
        read: false,
    },
    {
        id: 2,
        type: "critical",
        title: "Temperatura crítica",
        description: "La temperatura superó el límite configurado de seguridad.",
        device: "NEV-00482",
        time: "Hace 8 min",
        read: false,
    },
    {
        id: 3,
        type: "warning",
        title: "Batería baja",
        description: "El nivel de batería se encuentra por debajo del 20%.",
        device: "NEV-00821",
        time: "Hace 15 min",
        read: false,
    },
    {
        id: 4,
        type: "warning",
        title: "Desconexión intermitente",
        description: "Se detectaron varias pérdidas de comunicación.",
        device: "NEV-00214",
        time: "Hace 24 min",
        read: false,
    },
    {
        id: 5,
        type: "info",
        title: "Dispositivo conectado",
        description: "El dispositivo volvió a establecer comunicación.",
        device: "NEV-00631",
        time: "Hace 32 min",
        read: true,
    },
    {
        id: 6,
        type: "info",
        title: "Mantenimiento registrado",
        description: "Se registró una nueva actividad de mantenimiento.",
        device: "NEV-00915",
        time: "Hace 1 h",
        read: true,
    },
    {
        id: 7,
        type: "critical",
        title: "Puerta abierta",
        description: "La puerta permanece abierta durante más tiempo del permitido.",
        device: "NEV-00372",
        time: "Hace 1 h",
        read: false,
    },
];

function getNotificationConfig(type: AlertType) {
    switch (type) {
        case "critical":
            return {
                icon: Danger,
                iconClass: "text-danger-400",
                bgClass: "bg-danger-50/20",
                chipColor: "primary" as const,
                label: "Crítica",
                borderClass: "border-l-2 border-danger-300/30",
                dotColor: "bg-danger-400",
                hoverBg: "hover:bg-danger-50/10",
                titleClass: "text-primary",
            };
        case "warning":
            return {
                icon: CloseCircle,
                iconClass: "text-warning-500",
                bgClass: "bg-warning-50/20",
                chipColor: "primary" as const,
                label: "Advertencia",
                borderClass: "border-l-2 border-warning-300/30",
                dotColor: "bg-warning-500",
                hoverBg: "hover:bg-warning-50/10",
                titleClass: "text-primary",
            };
        default:
            return {
                icon: InfoCircle,
                iconClass: "text-primary-400",
                bgClass: "bg-primary-50/10",
                chipColor: "primary" as const,
                label: "Información",
                borderClass: "border-l-2 border-primary-300/30",
                dotColor: "bg-primary-400",
                hoverBg: "hover:bg-primary-50/10",
                titleClass: "text-primary-500",
            };
    }
}

export default function NotificationsPanel() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.read).length,
        [notifications]
    );

    const criticalCount = useMemo(
        () => notifications.filter((notification) => notification.type === "critical" && !notification.read).length,
        [notifications]
    );

    const warningCount = useMemo(
        () => notifications.filter((notification) => notification.type === "warning" && !notification.read).length,
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        if (activeFilter === "all") return notifications;
        return notifications.filter((notification) => notification.type === activeFilter);
    }, [notifications, activeFilter]);

    const markAsRead = (id: number) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({ ...notification, read: true }))
        );
    };

    return (
        <>
            <Button
                isIconOnly
                aria-label="Notificaciones"
                onPress={onOpen}
                className="relative h-11 w-11 min-w-11 rounded-full  bg-white/10 shadow-sm backdrop-blur-xl transition-all duration-300 hover:bg-white/80 dark:border-white/10 dark:bg-slate-900/40 dark:hover:bg-slate-800/60"
                
            >
                <Badge
                    content={unreadCount > 99 ? "99+" : unreadCount}
                    color="primary"
                    size="sm"
                    shape="circle"
                    isInvisible={unreadCount === 0}
                    classNames={{
                        badge: "text-[9px] min-w-4 h-4 px-1 font-bold border-2 border-background dark:text-black text-white",
                    }}
                >
                    <Bell weight="BoldDuotone" size={20} />
                </Badge>
            </Button>

            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="right"
                size="md"
                backdrop="opaque"
                motionProps={{
                    variants: {
                        enter: {
                            opacity: 1,
                            x: 0,
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                        },
                    },
                }}
                radius="none"
                classNames={{
                    base: "border border-white/50 bg-white shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/10",
                    header: "border-b border-white/30 bg-white/20 dark:border-white/10 dark:bg-slate-900/20",
                    body: "bg-white/10 dark:bg-slate-900/10",
                    footer: "border-t border-white/30 bg-white/20 before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-zinc-300 before:to-transparent dark:border-white/10 dark:bg-slate-900/20",
                }}
            >
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex-col items-stretch gap-4 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Bell weight="BoldDuotone" size={22} />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-foreground">Notificaciones</h2>
                                            <p className="text-xs text-default-400">Actividad de tus dispositivos</p>
                                        </div>
                                    </div>
                                    {unreadCount > 0 && (
                                        <Button
                                            size="sm"
                                            variant="light"
                                            startContent={<CheckRead size={16} />}
                                            color="primary"
                                            onPress={markAllAsRead}
                                            className="font-medium"
                                        >
                                            Marcar todas como leídas
                                        </Button>
                                    )}
                                </div>



                                <div className="flex gap-6 pt-4">
                                    {[
                                        { key: "all", label: "Todas", count: notifications.length, },
                                        { key: "critical", label: "Críticas", count: criticalCount, dot: "bg-danger-400", },
                                        { key: "warning", label: "Advertencias", count: warningCount, dot: "bg-warning-500", },
                                        { key: "info", label: "Información", count: unreadCount, dot: "bg-primary-400", },
                                    ].map((filter) => (
                                        <button
                                            key={filter.key}
                                            onClick={() =>
                                                setActiveFilter(filter.key as FilterType)
                                            }
                                            className={`relative flex items-center gap-1.5 pb-2 text-sm font-medium transition-all duration-200 ${activeFilter === filter.key
                                                ? "border-b-2 border-primary text-foreground"
                                                : "text-default-400 hover:text-default-600"
                                                }`}
                                        >
                                            {filter.dot && (
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${filter.dot}`}
                                                />
                                            )}

                                            <span>{filter.label}</span>
                                            <span
                                                className={`absolute -right-3 -top-2 flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold leading-none ${activeFilter === filter.key
                                                    ? "bg-primary/15 text-primary"
                                                    : "bg-default-100 text-default-400 dark:text-white"
                                                    }`}
                                            >
                                                {filter.count}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </DrawerHeader>

                            <DrawerBody className="px-0 py-0">
                                {filteredNotifications.length === 0 ? (
                                    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-default-100/50 text-default-400">
                                            <CheckCircle weight="BoldDuotone" size={40} />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-foreground">No hay alertas</h3>
                                        <p className="mt-1 max-w-xs text-sm text-default-400">
                                            No encontramos notificaciones para el filtro seleccionado.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        {filteredNotifications.map((notification) => {
                                            const config = getNotificationConfig(notification.type);
                                            const Icon = config.icon;

                                            return (
                                                <button
                                                    key={notification.id}
                                                    type="button"
                                                    onClick={() => markAsRead(notification.id)}
                                                    className={`
                                                        group relative w-full px-6 py-4 text-left transition-all
                                                        before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-gradient-to-r before:from-transparent before:via-zinc-300 before:to-transparent
                                                        ${config.hoverBg}
                                                        ${!notification.read ? "bg-primary/5" : ""}
                                                    `}
                                                >
                                                    {!notification.read && (
                                                        <span className={`absolute left-0 top-0 bottom-0 w-1 ${config.borderClass.replace('border-l-2', '')}`} />
                                                    )}
                                                    <div className="flex gap-4">
                                                        <Icon weight="Bold" size={24} className={`shrink-0 ${config.iconClass}`} />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <h3 className={`
                                                                        text-sm truncate
                                                                        ${!notification.read ? `font-semibold ${config.titleClass}` : "font-medium text-default-500"}
                                                                    `}>
                                                                        {notification.title}
                                                                    </h3>
                                                                    <p className="mt-0.5 text-xs text-default-600 dark:text-white/80">
                                                                        {notification.description}
                                                                    </p>
                                                                </div>
                                                                {!notification.read && (
                                                                    <span className={`mt-1 h-1.5 w-1.5 min-w-1.5 rounded-full ${config.dotColor}`} />
                                                                )}
                                                            </div>

                                                            <div className="mt-2 flex items-center gap-4">
                                                                <Chip
                                                                    size="sm"
                                                                    variant="flat"
                                                                    classNames={{
                                                                        base: "h-5 bg-default-100/50",
                                                                        content: "px-2 text-[9px] font-medium text-default-600",
                                                                    }}
                                                                >
                                                                    {config.label}
                                                                </Chip>

                                                                <div className="flex items-center gap-1 text-[10px] text-default-400">
                                                                    <FlashDrive size={11} />
                                                                    <span>{notification.device}</span>
                                                                </div>

                                                                <div className="flex items-center gap-1 text-[10px] text-default-400">
                                                                    <ClockCircle size={11} />
                                                                    <span>{notification.time}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <AltArrowRight
                                                            size={16}
                                                            className="mt-1 shrink-0 text-default-300 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                                                        />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </DrawerBody>

                            <DrawerFooter className="px-6 py-4">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs font-medium text-default-500">
                                            {filteredNotifications.length} alertas
                                        </p>
                                    </div>
                                    <Button
                                        variant="light"
                                        color="primary"
                                        size="sm"
                                        endContent={<AltArrowRight size={17} />}
                                        className="font-medium"
                                    >
                                        Ver historial
                                    </Button>
                                </div>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}