import {
    User,
    MinimalisticMagnifier,
    Calendar,
    Map,
    Hashtag,
    Cpu,
    Buildings2,
    MapPoint,
    Weigher,
    Box,
    ToPip,
    FolderFavouriteBookmark,
    MoveToFolder,
    Command,
} from "@solar-icons/react";
import type { FormField, FormGroup } from "../../../components/ux/ModalComponent";

export interface MedidorFormValues {
    serialNumber: string;
    podCode: string;
    imei: string;
    meterTypeId: string;
    meterBrandId: string;
    meterModelId: string;
    networkTechnologyId: string;
    clientCompanyId: string;
    providerCompanyId: string;
    installationAddress: string;
    latitude?: number | string;
    longitude?: number | string;
    ubigeoCode: string;
    connectionType: string
    initialValue: number;
    installationDate: string;
}

export const getMedidorFormFields = (options?: {
    meterTypes?: { value: string; label: string }[];
    brands?: { value: string; label: string }[];
    models?: { value: string; label: string }[];
    technologies?: { value: string; label: string }[];
    clientCompanies?: { value: string; label: string }[];
    providerCompanies?: { value: string; label: string }[];
}): FormField[] => {
    return [
        {
            name: "serialNumber",
            label: "Número de Serie",
            type: "text",
            placeholder: "Ingrese el número de serie",
            required: true,
            colSpan: 2,
            startContent: <User size={16} className="text-default-400" />,
            group: "Información del Medidor",
            validation: {
                required: "El número de serie es requerido",
                minLength: {
                    value: 3,
                    message: "El número de serie debe tener al menos 3 caracteres",
                },
            },
        },
        
        {
            name: "podCode",
            label: "Código POD",
            type: "text",
            placeholder: "Ingrese el código POD",
            required: false,
            colSpan: 1,
            startContent: <MinimalisticMagnifier size={16} className="text-default-400" />,
            group: "Información del Medidor",
        },
        // {
        //     name: "imei",
        //     label: "IMEI",
        //     type: "text",
        //     placeholder: "Ingrese el IMEI",
        //     required: false,
        //     colSpan: 1,
        //     startContent: <Phone size={16} className="text-default-400" />,
        //     group: "Información del Medidor",
        // },
        {
            name: "meterTypeId",
            label: "Tipo de Medidor",
            type: "select",
            placeholder: "Seleccione el tipo",
            required: true,
            colSpan: 1,
            options: options?.meterTypes,
            startContent: <MoveToFolder size={16} className="text-default-400" />,
            group: "Información del Medidor",
            validation: {
                required: "El tipo de medidor es requerido",
            },
        },
        {
            name: "meterBrandId",
            label: "Marca",
            type: "select",
            placeholder: "Seleccione la marca",
            required: true,
            colSpan: 1,
            options: options?.brands,
            startContent: <FolderFavouriteBookmark size={16} className="text-default-400" />,
            group: "Información del Medidor",
            validation: {
                required: "La marca es requerida",
            },
        },
        {
            name: "meterModelId",
            label: "Modelo",
            type: "select",
            placeholder: "Seleccione el modelo",
            required: true,
            colSpan: 1,
            options: options?.models,
            startContent: <Box size={16} className="text-default-400" />,
            group: "Información del Medidor",
            validation: {
                required: "El modelo es requerido",
            },
        },
        {
            name: "networkTechnologyId",
            label: "Tecnología de Red",
            type: "select",
            placeholder: "Seleccione la tecnología",
            required: false,
            colSpan: 1,
            options: options?.technologies || [
                { value: "", label: "Selecciona una tecnología..." },
                { value: "1", label: "LTE" },
                { value: "2", label: "NB-IoT" },
                { value: "3", label: "LoRa" },
            ],
            startContent: <Command size={16} className="text-default-400" />,
            group: "Información del Medidor",
        },
        {
            name: "connectionType",
            label: "Tipo de Conexión",
            type: "select",
            placeholder: "Seleccione el tipo de conexión",
            required: false,
            colSpan: 1,
            startContent: <ToPip size={16} className="text-default-400" />,
            group: "Información del Medidor",
            options: [
                { value: "UNDEFINED", label: "No definido" },
                { value: "INTEGRATED", label: "Integrado" },
                { value: "EXTERNAL_SENSOR", label: "Sensor externo" }
            ]
        },
        {
            name: "clientCompanyId",
            label: "Empresa Cliente",
            type: "select",
            placeholder: "Seleccione la empresa cliente",
            required: true,
            colSpan: 1,
            options: options?.clientCompanies || [
                { value: "", label: "Selecciona una empresa cliente..." },
            ],
            startContent: <Buildings2 size={16} className="text-default-400" />,
            group: "Empresas",
            validation: {
                required: "La empresa cliente es requerida",
            },
        },
        {
            name: "providerCompanyId",
            label: "Empresa Proveedora",
            type: "select",
            placeholder: "Seleccione el proveedor",
            required: true,
            colSpan: 1,
            options: options?.providerCompanies || [
                { value: "", label: "Selecciona una empresa proveedora..." },
            ],
            startContent: <Buildings2 size={16} className="text-default-400" />,
            group: "Empresas",
            validation: {
                required: "La empresa proveedora es requerida",
            },
        },
        {
            name: "installationAddress",
            label: "Dirección de Instalación",
            type: "textarea",
            placeholder: "Ingrese la dirección completa",
            required: false,
            colSpan: 2,
            startContent: <Map size={16} className="text-default-400" />,
            group: "Ubicación",
        },
        {
            name: "latitude",
            label: "Latitud",
            type: "number",
            placeholder: "-12.0464",
            required: false,
            colSpan: 1,
            startContent: <MapPoint size={16} className="text-default-400" />,
            group: "Ubicación",
        },
        {
            name: "longitude",
            label: "Longitud",
            type: "number",
            placeholder: "-77.0428",
            required: false,
            colSpan: 1,
            startContent: <MapPoint size={16} className="text-default-400" />,
            group: "Ubicación",
        },
        {
            name: "ubigeoCode",
            label: "Código Ubigeo",
            type: "text",
            placeholder: "150101",
            required: false,
            colSpan: 2,
            startContent: <Map size={16} className="text-default-400" />,
            group: "Ubicación",
        },

        {
            name: "initialValue",
            label: "Valor Inicial (L)",
            type: "number",
            placeholder: "0",
            required: false,
            colSpan: 1,
            startContent: <Hashtag size={16} className="text-default-400" />,
            group: "Instalación",
            validation: {
                min: {
                    value: 0,
                    message: "El valor inicial debe ser mayor o igual a 0",
                },
            },
        },
        {
            name: "installationDate",
            label: "Fecha de Instalación",
            type: "date",
            required: false,
            colSpan: 1,
            startContent: <Calendar size={16} className="text-default-400" />,
            group: "Instalación",
        },
    ];
};

export const getMedidorFormGroups = (): FormGroup[] => [
    {
        title: "Información del Medidor",
        icon: <Cpu size={18} weight="Bold" />,
        description: "Datos técnicos del medidor",
        fields: [
            "serialNumber",
            "podCode",
            "imei",
            "meterTypeId",
            "meterBrandId",
            "meterModelId",
            "networkTechnologyId",
        ],
    },
    {
        title: "Empresas",
        icon: <Buildings2 size={18} weight="Bold" />,
        description: "Empresas cliente y proveedora",
        fields: ["clientCompanyId", "providerCompanyId"],
    },
    {
        title: "Ubicación",
        icon: <MapPoint size={18} weight="Bold" />,
        description: "Datos de ubicación del medidor",
        fields: ["installationAddress", "latitude", "longitude", "ubigeoCode"],
    },
    {
        title: "Instalación",
        icon: <Weigher size={18} weight="Bold" />,
        description: "Datos de instalación del medidor",
        fields: ["initialValue", "installationDate"],
    },
];

export const getMedidorInitialValues = (): MedidorFormValues => ({
    serialNumber: "",
    podCode: "",
    imei: "",
    meterTypeId: "",
    meterBrandId: "",
    meterModelId: "",
    networkTechnologyId: "",
    clientCompanyId: "",
    providerCompanyId: "",
    installationAddress: "",
    latitude: "",
    longitude: "",
    ubigeoCode: "",
    initialValue: 0,
    installationDate: new Date().toISOString().split('T')[0],
    connectionType: ""
});

export const mapMedidorToFormValues = (medidor: any): MedidorFormValues => ({
    serialNumber: medidor.numeroSerie || "",
    podCode: medidor.codigoPod || "",
    imei: medidor.imei || "",
    meterTypeId: String(medidor.meterTypeId || medidor.tipoMedidor || ""),
    meterBrandId: String(medidor.meterBrandId || medidor.marca || ""),
    meterModelId: String(medidor.meterModelId || medidor.modelo || ""),
    networkTechnologyId: String(medidor.networkTechnologyId || medidor.tecnologiaRed || ""),
    clientCompanyId: String(medidor.clientCompanyId || medidor.empresaCliente || ""),
    providerCompanyId: String(medidor.providerCompanyId || medidor.empresaProveedora || ""),
    installationAddress: medidor.installationAddress || medidor.direccion || "",
    latitude: medidor.latitude || medidor.latitud || "",
    longitude: medidor.longitude || medidor.longitud || "",
    ubigeoCode: medidor.ubigeoCode || "",
    initialValue: medidor.initialValue || medidor.valorInicial || 0,
    installationDate: medidor.installationDate || medidor.fechaInstalacion
        ? new Date(medidor.installationDate || medidor.fechaInstalacion).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    connectionType: medidor.connectionType || ""
});