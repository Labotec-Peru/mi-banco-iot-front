import { API } from "../../../config/env";

interface OpcionType {
  codigo: number;
  nombre: string;
  ruta: string;
}

interface DistribuidorPermitido {
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

export const loginAPI = async (
  email: string,
  password: string
): Promise<UserAPIType> => {
  if (!API) {
    throw new Error("No hay una URL de autenticación configurada.");
  }

  const response = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData?.message ||
      errorData?.error ||
      "Credenciales incorrectas o servicio no disponible."
    );
  }

  const data = await response.json();

  if (!data?.token) {
    throw new Error("No se recibió el token de autenticación.");
  }

  return {
    id: data.id ?? 0,
    username: data.username ?? "",
    roles: data.roles ?? [],
    opciones: data.opciones ?? [],
    distribuidoresPermitidos: data.distribuidoresPermitidos ?? [],
    accessToken: data.token,
    refreshToken: data.refresh_token,
    expiration: data.expiration,
    tokenType: "Bearer",
  };
};