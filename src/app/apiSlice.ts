// app/apiSlice.ts

import { createApi, fetchBaseQuery, type BaseQueryApi, type FetchArgs } from '@reduxjs/toolkit/query/react';
import { jwtDecode } from 'jwt-decode';
import { API } from '../config/env';
import { logout } from '../features/auth/authSlice';
import { addToast } from "@heroui/react";

interface JWTPayload {
  exp: number;
}

const buildErrorMessage = (backendError: any) => {
  const baseMessage = backendError?.errorCode?.message || backendError?.messageType || "Ocurrió un error";

  if (backendError?.errors && typeof backendError.errors === "object") {
    const detalles = Object.entries(backendError.errors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join("\n");
    return { title: baseMessage, description: detalles };
  }

  return { title: baseMessage, description: undefined };
};

const baseQuery = fetchBaseQuery({
  baseUrl: API,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithInterceptor = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        console.warn("El token ha expirado.");
        api.dispatch(logout());
        window.location.href = '/';
        return { error: { status: 401, data: { message: "Sesión expirada" } } };
      }
    } catch (e) {
      console.error("Token corrupto.");
      api.dispatch(logout());
      window.location.href = '/';
      return { error: { status: 401, data: { message: "Token inválido" } } };
    }
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const backendError = result.error.data;

    if (status === 401) {
      console.warn("Servidor rechazó el token (401)");
      localStorage.removeItem("token");
      api.dispatch(logout());
      
      addToast({
        title: "Sesión expirada",
        description: "Vuelve a iniciar sesión",
        color: "danger",
        variant: "bordered"
      });

      window.location.href = '/';
      return result;
    }

    if (backendError) {
      const { title, description } = buildErrorMessage(backendError);

      addToast({
        title,
        description,
        color: "danger",
        variant: "bordered"
      });

      api.dispatch({
        type: 'error/setError',
        payload: backendError,
      });
    } else {
      addToast({
        title: "Error de conexión",
        description: "No se pudo conectar con el servidor",
        color: "danger",
        variant: "bordered"
      });
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptor,
  tagTypes: [
    'User', 
    'WaterMeters',      
    'MyWaterMeters',    
    'WaterMeter'        
  ] as const, 
  endpoints: () => ({}),
});

export type TagTypes = 'User' | 'WaterMeters' | 'MyWaterMeters' | 'WaterMeter';