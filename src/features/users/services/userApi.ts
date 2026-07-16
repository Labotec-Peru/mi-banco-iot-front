import { apiSlice } from "../../../app/apiSlice";
import { API_NESTLE } from "../../../config/env";


export interface UserItem {
    usu_id: number;
    usu_nombre: string;
    usu_correo: string;
    usu_telefono: string;
    usu_cargo: string;
    usu_usuario: string;
    usu_contrasena: string;
    usu_tipo: string;
    usu_estado: string;
    usu_lista_distribuidores: number[];
}

export interface UserResponse {
    status: boolean;
    message?: string;
    totalRegistros?: number;
    data: UserItem[];
}


export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getUsers: builder.query<UserResponse, void>({
            query: () => ({
                url: `${API_NESTLE}/api/Consultas/listaUsuariosNestle?empresa=9`,                               
            }),
        }),
    }),
    overrideExisting: false,
});


export const {
    useGetUsersQuery,
} = userApi;


