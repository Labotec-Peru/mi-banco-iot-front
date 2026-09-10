import {
    User as UserIcon,
    Mailbox,
    Phone,
    Document,
    Key,
    Global,
    UsersGroupRounded,
    Tag,
    Gallery,
    Bell,
    UserId
} from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface UserFormValues {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    documentNumber: string;
    documentType: string;
    phone: string;
    timeZone: string;
    status: string;
    imageUrl: string;
    roles: string[];
    scopes: string[];
    tagIds: number[];
    groupIds: number[];
    attachmentIds: number[];
    emails: string[];
    phones: string[];
    views: string[];
    notifications: string[];
    latitude: string;
    longitude: string;

}

export interface SelectOption {
    value: string;
    label: string;
}

const timeZones: SelectOption[] = [
    { value: "UTC", label: "UTC" },
    { value: "America/Lima", label: "America/Lima" },
    { value: "America/Bogota", label: "America/Bogota" },
    { value: "America/Mexico_City", label: "America/Mexico_City" },
    { value: "America/New_York", label: "America/New_York" },
];

const documentTypes: SelectOption[] = [
    { value: "dni", label: "DNI" },
    { value: "passport", label: "Pasaporte" },
    { value: "ruc", label: "RUC" },
    { value: "ce", label: "Carnet de Extranjería" },
];

const userStatuses: SelectOption[] = [
    { value: "ACTIVE", label: "Activo" },
    { value: "INACTIVE", label: "Inactivo" },
    { value: "PENDING", label: "Pendiente" },
    { value: "BLOCKED", label: "Bloqueado" },
];

const roleOptions: SelectOption[] = [
    { value: "SUPER_ADMIN", label: "Super Admin" },
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "Usuario" },
    { value: "VIEWER", label: "Visor" },
];

const viewOptions: SelectOption[] = [
    { value: "VEHICLE_TRACKING_RESUMEN", label: "Resumen Vehículos" },
    { value: "DASHBOARD", label: "Dashboard" },
    { value: "REPORTS", label: "Reportes" },
];

const notificationOptions: SelectOption[] = [
    { value: "sms", label: "SMS" },
    { value: "email", label: "Email" },
    { value: "push", label: "Push Notification" },
];

export const getUserFormFields = (
    tagOptions: SelectOption[] = [],
    groupOptions: SelectOption[] = [],
    attachmentOptions: SelectOption[] = [],
    mode: 'create' | 'edit' = 'create'
): FormField[] => {
    const baseFields: FormField[] = [
        {
            name: "firstName",
            label: "Nombres",
            type: "text",
            placeholder: "Ingresa los nombres",
            required: true,
            colSpan: 1,
            startContent: <UserIcon size={16} className="text-default-400" />,
            group: "Información Personal",
        },
        {
            name: "lastName",
            label: "Apellidos",
            type: "text",
            placeholder: "Ingresa los apellidos",
            required: true,
            colSpan: 1,
            startContent: <UserIcon size={16} className="text-default-400" />,
            group: "Información Personal",
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "Ingresa el email",
            required: true,
            colSpan: 2,
            startContent: <Mailbox size={16} className="text-default-400" />,
            group: "Información Personal",
        },
        {
            name: "phone",
            label: "Teléfono",
            type: "text",
            placeholder: "Ingresa el teléfono",
            required: true,
            colSpan: 2,
            startContent: <Phone size={16} className="text-default-400" />,
            group: "Información Personal",
        },
        {
            name: "documentType",
            label: "Tipo de Documento",
            type: "select",
            placeholder: "Selecciona el tipo",
            required: true,
            colSpan: 1,
            startContent: <Document size={16} className="text-default-400" />,
            group: "Información Personal",
            options: documentTypes,
        },
        {
            name: "documentNumber",
            label: "Número de Documento",
            type: "text",
            placeholder: "Ingresa el número de documento",
            required: true,
            colSpan: 1,
            startContent: <UserId size={16} className="text-default-400" />,
            group: "Información Personal",
        },
        {
            name: "imageUrl",
            label: "URL de Imagen",
            type: "text",
            placeholder: "URL de la imagen de perfil",
            required: false,
            colSpan: 2,
            startContent: <Gallery size={16} className="text-default-400" />,
            group: "Información Personal",
        },
        {
            name: "timeZone",
            label: "Zona Horaria",
            type: "select",
            placeholder: "Selecciona la zona horaria",
            required: false,
            colSpan: 2,
            startContent: <Global size={16} className="text-default-400" />,
            group: "Información Personal",
            options: timeZones,
        },
    ];

    const passwordField: FormField = {
        name: "password",
        label: "Contraseña",
        type: "password",
        placeholder: "Ingresa la contraseña",
        required: mode === 'create',
        colSpan: 2,
        startContent: <Key size={16} className="text-default-400" />,
        group: "Información de Seguridad",
    };

    const securityFields: FormField[] = [
        passwordField,
        {
            name: "status",
            label: "Estado",
            type: "select",
            placeholder: "Selecciona el estado",
            required: false,
            colSpan: 2,
            group: "Información de Seguridad",
            options: userStatuses,
        },
        {
            name: "roles",
            label: "Roles",
            type: "select",
            multiple: true,
            placeholder: "Selecciona los roles",
            required: false,
            colSpan: 1,
            startContent: <UsersGroupRounded size={16} className="text-default-400" />,
            group: "Información de Seguridad",
            options: roleOptions,
        },
        {
            name: "scopes",
            label: "Scopes",
            type: "select",
            multiple: true,
            placeholder: "Selecciona los scopes",
            required: false,
            colSpan: 1,
            group: "Información de Seguridad",
            options: [
                { value: "tenant_add_access", label: "Tenant Add Access" },
                { value: "tenant_view_access", label: "Tenant View Access" },
                { value: "user_management", label: "User Management" },
            ],
        },
    ];

    const additionalFields: FormField[] = [
        {
            name: "tagIds",
            label: "Tags",
            type: "select",
            multiple: true,
            placeholder: "Selecciona los tags",
            required: false,
            colSpan: 1,
            startContent: <Tag size={16} className="text-default-400" />,
            group: "Configuración Adicional",
            options: tagOptions.length > 0 ? tagOptions : [{ value: "", label: "No hay tags disponibles" }],
        },
        {
            name: "groupIds",
            label: "Grupos",
            type: "select",
            multiple: true,
            placeholder: "Selecciona los grupos",
            required: false,
            colSpan: 1,
            startContent: <UsersGroupRounded size={16} className="text-default-400" />,
            group: "Configuración Adicional",
            options: groupOptions.length > 0 ? groupOptions : [{ value: "", label: "No hay grupos disponibles" }],
        },
        {
            name: "attachmentIds",
            label: "Archivos Adjuntos",
            type: "select",
            multiple: true,
            placeholder: "Selecciona los archivos adjuntos",
            required: false,
            colSpan: 2,
            startContent: <Gallery size={16} className="text-default-400" />,
            group: "Configuración Adicional",
            options: attachmentOptions.length > 0 ? attachmentOptions : [{ value: "", label: "No hay archivos disponibles" }],
        },
        {
            name: "views",
            label: "Vistas",
            type: "select",
            multiple: true,
            placeholder: "Selecciona las vistas",
            required: false,
            colSpan: 2,
            group: "Configuración Adicional",
            options: viewOptions,
        },
        {
            name: "notifications",
            label: "Notificaciones",
            type: "select",
            multiple: true,
            placeholder: "Selecciona las notificaciones",
            required: false,
            colSpan: 2,
            startContent: <Bell size={16} className="text-default-400" />,
            group: "Configuración Adicional",
            options: notificationOptions,
        },
        {
            name: "emails",
            label: "Emails Adicionales",
            type: "textarea",
            placeholder: "Ingresa emails adicionales (separados por coma)",
            required: false,
            colSpan: 2,
            group: "Configuración Adicional",
        },
        {
            name: "phones",
            label: "Teléfonos Adicionales",
            type: "textarea",
            placeholder: "Ingresa teléfonos adicionales (separados por coma)",
            required: false,
            colSpan: 2,
            group: "Configuración Adicional",
        },
        {
            name: "latitude",
            label: "Latitud",
            type: "text",
            placeholder: "Ingresa la latitud",
            required: false,
            colSpan: 1,
            group: "Configuración Adicional",
        },
        {
            name: "longitude",
            label: "Longitud",
            type: "text",
            placeholder: "Ingresa la longitud",
            required: false,
            colSpan: 1,
            group: "Configuración Adicional",
        },
    ];

    return [...baseFields, ...securityFields, ...additionalFields];
};

export const getUserFormGroups = (): FormGroup[] => [
    {
        title: "Información Personal",
        icon: <UserIcon size={18} weight="Bold" />,
        description: "Datos personales del usuario",
        fields: ["firstName", "lastName", "email", "phone", "documentType", "documentNumber", "imageUrl", "timeZone"],
    },
    {
        title: "Información de Seguridad",
        icon: <Key size={18} weight="Bold" />,
        description: "Credenciales y permisos",
        fields: ["password", "status", "roles", "scopes"],
    },
    {
        title: "Configuración Adicional",
        icon: <UsersGroupRounded size={18} weight="Bold" />,
        description: "Configuraciones extra del usuario",
        fields: ["tagIds", "groupIds", "attachmentIds", "views", "notifications", "emails", "phones", "latitude", "longitude"], 
    },
];

export const getUserInitialValues = (): UserFormValues => ({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    documentNumber: "",
    documentType: "dni",
    phone: "",
    timeZone: "UTC",
    status: "ACTIVE",
    imageUrl: "",
    roles: [],
    scopes: [],
    tagIds: [],
    groupIds: [],
    attachmentIds: [],
    emails: [],
    phones: [],
    views: [],
    notifications: [],
    latitude: "",
    longitude: "",
});

export const mapUserToFormValues = (user: any): UserFormValues => ({
    email: user?.email || "",
    password: "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    documentNumber: user?.documentNumber || "",
    documentType: user?.documentType || "dni",
    phone: user?.phone || "",
    timeZone: user?.timeZone || "UTC",
    status: user?.status || "ACTIVE",
    imageUrl: user?.imageUrl || "",
    roles: user?.roles || [],
    scopes: user?.scopes || [],
    tagIds: user?.tags?.map((t: any) => t.id) || [],
    groupIds: user?.groups?.map((g: any) => g.id) || [],
    attachmentIds: user?.attachments?.map((a: any) => a.id) || [],
    emails: user?.emails || [],
    phones: user?.phones || [],
    views: user?.views || [],
    notifications: user?.notifications || [],
    latitude: user?.latitude || "",
    longitude: user?.longitude || "",
});