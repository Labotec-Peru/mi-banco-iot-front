import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    define: {
      'process.env.VITE_API': JSON.stringify(env.VITE_API),
      'process.env.VITE_API_NESTLE': JSON.stringify(env.VITE_API_NESTLE),
      'process.env.VITE_API_MEGALAB': JSON.stringify(env.VITE_API_MEGALAB),
      'process.env.VITE_API_ALMACENES': JSON.stringify(env.VITE_API_ALMACENES),
      'process.env.VITE_API_CONDOMINIOS': JSON.stringify(env.VITE_API_CONDOMINIOS),
      'process.env.VITE_RECAPTCHA_TOKEN': JSON.stringify(env.VITE_RECAPTCHA_TOKEN),
      'process.env.VITE_MAPBOX_TOKEN': JSON.stringify(env.VITE_MAPBOX_TOKEN),
      'process.env.VITE_POWERBI_URL': JSON.stringify(env.VITE_POWERBI_URL),
      'process.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
    }
  };
});