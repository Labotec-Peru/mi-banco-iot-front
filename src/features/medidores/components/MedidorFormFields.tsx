import { 
    User,
    MinimalisticMagnifier, 
    Phone, 
    MapArrowDown, 
    Calendar,
    Buildings,
    Map,
    Hashtag,
    Global,
    Cpu,
    Buildings2,
    MapPoint,
    Weigher,
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
        {
            name: "imei",
            label: "IMEI",
            type: "text",
            placeholder: "Ingrese el IMEI",
            required: false,
            colSpan: 1,
            startContent: <Phone size={16} className="text-default-400" />,
            group: "Información del Medidor",
        },
        {
            name: "meterTypeId",
            label: "Tipo de Medidor",
            type: "select",
            placeholder: "Seleccione el tipo",
            required: true,
            colSpan: 1,
            options: options?.meterTypes || [
                { value: "1", label: "Agua" },
                { value: "2", label: "Gas" },
                { value: "3", label: "Electricidad" },
            ],
            startContent: <MapArrowDown size={16} className="text-default-400" />,
            group: "Información del Medidor",
        },
        {
            name: "meterBrandId",
            label: "Marca",
            type: "select",
            placeholder: "Seleccione la marca",
            required: true,
            colSpan: 1,
            options: options?.brands || [
                { value: "1", label: "Marca A" },
                { value: "2", label: "Marca B" },
                { value: "3", label: "Marca C" },
            ],
            startContent: <Buildings size={16} className="text-default-400" />,
            group: "Información del Medidor",
        },
        {
            name: "meterModelId",
            label: "Modelo",
            type: "select",
            placeholder: "Seleccione el modelo",
            required: true,
            colSpan: 1,
            options: options?.models || [
                { value: "1", label: "Modelo X" },
                { value: "2", label: "Modelo Y" },
                { value: "3", label: "Modelo Z" },
            ],
            startContent: <Hashtag size={16} className="text-default-400" />,
            group: "Información del Medidor",
        },
        {
            name: "networkTechnologyId",
            label: "Tecnología de Red",
            type: "select",
            placeholder: "Seleccione la tecnología",
            required: false,
            colSpan: 1,
            options: options?.technologies || [
                { value: "1", label: "LTE" },
                { value: "2", label: "NB-IoT" },
                { value: "3", label: "LoRa" },
            ],
            startContent: <Global size={16} className="text-default-400" />,
            group: "Información del Medidor",
        },

        {
            name: "clientCompanyId",
            label: "Empresa Cliente",
            type: "select",
            placeholder: "Seleccione la empresa cliente",
            required: true,
            colSpan: 1,
            options: options?.clientCompanies || [
                { value: "1", label: "Empresa A" },
                { value: "2", label: "Empresa B" },
                { value: "3", label: "Empresa C" },
            ],
            startContent: <Buildings2 size={16} className="text-default-400" />,
            group: "Empresas",
        },
        {
            name: "providerCompanyId",
            label: "Empresa Proveedora",
            type: "select",
            placeholder: "Seleccione el proveedor",
            required: true,
            colSpan: 1,
            options: options?.providerCompanies || [
                { value: "1", label: "Proveedor A" },
                { value: "2", label: "Proveedor B" },
                { value: "3", label: "Proveedor C" },
            ],
            startContent: <Buildings2 size={16} className="text-default-400" />,
            group: "Empresas",
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
            colSpan: 1,
            startContent: <MapPoint size={16} className="text-default-400" />,
            group: "Ubicación",
        },
        {
            name: "longitude",
            label: "Longitud",
            type: "number",
            placeholder: "-77.0428",
            colSpan: 1,
            startContent: <MapPoint size={16} className="text-default-400" />,
            group: "Ubicación",
        },
        {
            name: "ubigeoCode",
            label: "Código Ubigeo",
            type: "text",
            placeholder: "150101",
            colSpan: 2,
            startContent: <Map size={16} className="text-default-400" />,
            group: "Ubicación",
        },

        {
            name: "initialValue",
            label: "Valor Inicial (L)",
            type: "number",
            placeholder: "0",
            colSpan: 1,
            startContent: <Hashtag size={16} className="text-default-400" />,
            group: "Instalación",
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
        icon: <Cpu size={18}  weight="Bold" />,
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
        icon: <Buildings2 size={18}  weight="Bold"/>,
        description: "Empresas cliente y proveedora",
        fields: ["clientCompanyId", "providerCompanyId"],
    },
    {
        title: "Ubicación",
        icon: <MapPoint size={18}  weight="Bold"/>,
        description: "Datos de ubicación del medidor",
        fields: ["installationAddress", "latitude", "longitude", "ubigeoCode"],
    },
    {
        title: "Instalación",
        icon: <Weigher size={18}  weight="Bold"/>,
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
});


export const mapMedidorToFormValues = (medidor: any): MedidorFormValues => ({
    serialNumber: medidor.numeroSerie || "",
    podCode: medidor.codigoPod || "",
    imei: medidor.imei || "",
    meterTypeId: medidor.tipoMedidor || "",
    meterBrandId: medidor.marca || "",
    meterModelId: medidor.modelo || "",
    networkTechnologyId: medidor.tecnologiaRed || "",
    clientCompanyId: medidor.empresaCliente || "",
    providerCompanyId: medidor.empresaProveedora || "",
    installationAddress: medidor.direccion || "",
    latitude: medidor.latitud || "",
    longitude: medidor.longitud || "",
    ubigeoCode: medidor.ubigeoCode || "",
    initialValue: medidor.valorInicial || 0,
    installationDate: medidor.fechaInstalacion 
        ? new Date(medidor.fechaInstalacion).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
});