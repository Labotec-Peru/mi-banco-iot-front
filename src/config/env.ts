export const API_ENTEL_CORE = import.meta.env.VITE_API_ENTEL_CORE;
export const API_NESTLE = import.meta.env.VITE_API_NESTLE;
export const API_MEGALAB = import.meta.env.VITE_API_MEGALAB;
export const API_ALMACENES = import.meta.env.VITE_API_ALMACENES;
export const API_CONDOMINIOS = import.meta.env.VITE_API_CONDOMINIOS;
export const RECAPTCHA_TOKEN = import.meta.env.VITE_RECAPTCHA_TOKEN
export const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_TOKEN
if (!API_ENTEL_CORE || !API_NESTLE || !API_MEGALAB || !API_ALMACENES || !API_CONDOMINIOS) {
  console.warn("Configuración de entorno incompleta en el archivo .env");
}