import { apiSlice } from "../../../app/apiSlice";
import { API_NESTLE } from "../../../config/env";

export interface AlertsItem {
    alert_dis_cod_nevera: string;
    alert_dis_imei: string;
    alert_loc_nom: string;
    alert_dis_distribuidor: string;
    alert_dis_lat: string;
    alert_dis_lon: string;
    alert_evento: string;
    alert_dis_fechahora: string;
    alert_dis_bateria: string;
    alert_dis_energia: string;
    alert_dis_signal: string;
    alert_dis_satelite: string;
    alert_dis_cliente: string;
}

export interface AlertsFilters {
    _cliente?: string;
    _cod_nevera?: string;
    _distribuidor?: string;
    _evento?: string;
    _fecha_hora?: string;
    _imei?: string;
    _locacion?: string;
    _or?: string;
    _order?: string;
    _page?: number;
    _size?: number;
}

export interface AlertsResponse {
    status: boolean;
    message?: string;
    totalRegistros?: number;
    data: AlertsItem[];
}

export const alertsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAlertsHistorical: builder.query<AlertsResponse, AlertsFilters>({
            query: (filters) => ({
                url: `${API_NESTLE}/api/Consultas/listaAlertasActivasV2`,
                method: "POST",
                body: {
                    _cliente: filters._cliente,
                    _cod_nevera: filters._cod_nevera,
                    _distribuidor: filters._distribuidor,
                    _evento: filters._evento,
                    _fecha_hora: filters._fecha_hora,
                    _imei: filters._imei,
                    _locacion: filters._locacion,
                    _or: filters._or,
                    _order: filters._order,
                    _page: filters._page,
                    _size: filters._size,
                },
            }),
        }),
        getAlertsHistoricalV2: builder.query<AlertsResponse, AlertsFilters>({
            query: (filters) => ({
                url: `${API_NESTLE}/api/Consultas/listaAlertasHistorialV2`,
                method: "POST",
                body: {
                    _cliente: filters._cliente,
                    _cod_nevera: filters._cod_nevera,
                    _distribuidor: filters._distribuidor,
                    _evento: filters._evento,
                    _fecha_hora: filters._fecha_hora,
                    _imei: filters._imei,
                    _locacion: filters._locacion,
                    _or: filters._or,
                    _order: filters._order,
                    _page: filters._page,
                    _size: filters._size,
                },
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAlertsHistoricalQuery,
    useGetAlertsHistoricalV2Query,
} = alertsApi;


