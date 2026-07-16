import { apiSlice } from "../../../app/apiSlice";
import { API_NESTLE } from "../../../config/env";

export interface DeviceItem {
    dis_id: number;
    dis_cod_nevera: string;
    dis_imei: string;
    dis_iccid: string;
    dis_version: string;
    dis_distribuidor: string;
    dis_cliente: string;
    dis_loc_nom: string;
    dis_latitud: string;
    dis_longitud: string;
    dis_geozona: string;
    dis_movimiento: string;
    dis_energia: string;
    dis_bateria: string;
    dis_estado: string;
    dis_ubigeo: string;
}

export interface NeveraFilters {
    _cod_nevera?: string;
    _page?: number;
    _size?: number;
}

export interface NeveraResponse {
    status: boolean;
    message?: string;
    totalRegistros?: number;
    data: DeviceItem[];
}


export const deviceApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getDevice: builder.query<NeveraResponse, NeveraFilters>({
            query: (filters) => ({
                url: `${API_NESTLE}/api/Consultas/listaDispositivosNeverasV2`,
                method: "POST",
                body: {
                    _cod_nevera: filters._cod_nevera,
                    _page: filters._page,
                    _size: filters._size,
                },
            }),
        }),
    }),
    overrideExisting: false,
});


export const {
    useGetDeviceQuery,
} = deviceApi;