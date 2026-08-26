import { apiSlice } from "../../../app/apiSlice";

export interface OpcionType {
  codigo: number;
  nombre: string;
  ruta: string;
}

export interface DistribuidorPermitido {
  cod_distribuidor: number;
  name_distribuidor: string;
}

export interface UserAPIType {
  id: number;
  username: string;
  roles: string[];
  opciones: OpcionType[];
  accessToken: string;
  refreshToken: string;
  expiration: number;
  tokenType: string;
  distribuidoresPermitidos: DistribuidorPermitido[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<UserAPIType, LoginCredentials>({
      query: (credentials) => ({
        url: "/mah/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (data: any): UserAPIType => ({
        id: data.id ?? 0,
        username: data.username ?? "",
        roles: data.roles ?? [],
        opciones: data.opciones ?? [],
        distribuidoresPermitidos: data.distribuidoresPermitidos ?? [],
        accessToken: data.token,
        refreshToken: data.refresh_token,
        expiration: data.expiration,
        tokenType: "Bearer",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation } = authApi;