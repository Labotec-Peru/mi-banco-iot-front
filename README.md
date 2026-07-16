#  2026-entel-frontend (Plataforma de Monitoreo IoT en Tiempo Real)

Este proyecto es el Frontend modular y escalable construido para la visualización en tiempo real de neveras y otros dispositivos IoT (Internet de las Cosas). Está diseñado siguiendo las mejores prácticas de la industria para soportar un alto volumen de datos dinámicos, mapas interactivos y un estado global centralizado.

---

##  Stack Tecnológico Principal

*   **Estructura Base:** React v18.3.1 + TypeScript + Vite (Configuración moderna y ultra rápida).
*   **Gestor de Paquetes:** `pnpm` (Eficiencia máxima de espacio en disco y velocidad mediante enlaces inteligentes).
*   **Estilos y UI:** Tailwind CSS v4.3.2 (Última generación basada en CSS nativo) + HeroUI v2.8.10 (Componentes pulidos y accesibles).
*   **Mapas y Geo-localización:** Mapbox GL v3.25.0 (Para el rastreo visual en tiempo real de las neveras).
*   **Gestión de Estado y APIs:** Redux Toolkit + RTK Query (Centralización de peticiones HTTP, caché automático e interceptores).
*   **Enrutado:** React Router Dom v6+ (Data Router con `createBrowserRouter`).

---

## Arquitectura de Carpetas Escalable (Feature-Based)

El código fuente en `src/` se organizó de la siguiente manera para permitir que el proyecto crezca de forma limpia sin crear dependencias circulares:

```text
src/
├── app/                  # Configuración central de la aplicación (Store de Redux, apiSlice global)
├── assets/               # Archivos estáticos (Imágenes, logos, SVGs)
├── components/           # Componentes atómicos globales reutilizables (Botones, inputs genéricos)
├── config/               # Variables de entorno y configuraciones tipadas estrictamente (env.ts)
├── features/             # Módulos de negocio (ej: features/neveras, features/auth)
│   └── neveras/          # Cada módulo maneja sus propias páginas, componentes internos y endpoints
├── helpers/              # Funciones ligadas a reglas de negocio del proyecto
├── hooks/                # Custom hooks puramente globales (useLocalStorage, useDebounce)
├── layouts/              # Estructuras visuales compartidas (Sidebar, Navbar, MainLayout)
├── routes/               # Sistema de enrutado centralizado de la aplicación
└── utils/                # Utilidades puramente matemáticas o genéricas de JavaScript

---

##  Guía de Instalación Paso a Paso

Sigue estos pasos para levantar el entorno de desarrollo local exactamente con las versiones aprobadas y estables del proyecto:

### 1️ Inicializar Dependencias Estrictas (React 18)

Para asegurar compatibilidad absoluta con el ecosistema de mapas y la librería de UI, fijamos el entorno en **React v18.3.1**. Corre el siguiente comando para instalar todos los paquetes base:

```bash
pnpm add @heroui/react@2.8.10 @heroui/theme framer-motion@11.11.0 mapbox-gl@3.25.0 react@18.3.1 react-dom@18.3.1 tailwindcss@4.3.2 @tailwindcss/vite@4.3.2

```

A continuación, instala los tipos estrictos de soporte para TypeScript como dependencias de desarrollo:

```bash
pnpm add -D @types/react@18.3.1 @types/react-dom@18.3.1

```

### 2️ Configurar Directivas de Seguridad en `package.json`

`pnpm` cuenta con políticas estrictas de seguridad para la cadena de suministro. Para permitir que HeroUI compile sus scripts internos sin bloqueos, abre tu `package.json` y añade este bloque al final del archivo:

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "@heroui/shared-utils"
  ]
}

```

### 3️ Integrar Tailwind v4 con Vite

Olvídate de los archivos masivos de configuración `.js`. En esta versión, Tailwind se conecta de manera nativa como un plugin del compilador.

Abre tu archivo `vite.config.ts` y añade el plugin:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Integración de Tailwind v4

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss() // <-- Activación del plugin
  ],
})

```

Finalmente, configura el punto de entrada de estilos en `src/index.css`. Aquí le indicamos a Tailwind que escanee los componentes de HeroUI para inyectar los estilos correctos:

```css
@import "tailwindcss";

/* Escáner de componentes para HeroUI */
@config "../tailwind.config.js"


```

---

##  Gestión de Entornos (`.env`)

Para mantener la flexibilidad, las URLs de las APIs nunca se escriben directamente en el código fuente. Se manejan a través de variables de entorno protegidas con el prefijo obligatorio `VITE_`.

Debes crear **dos archivos en la raíz** del proyecto (al mismo nivel del `package.json`):

***`.env.development`** *(Modo desarrollo - Peticiones a la API de pruebas)*
```env
VITE_API_URL=https://apisdev.com/development

```


***`.env.production`** *(Modo producción - Peticiones al servidor final de la app)*
```env
VITE_API_URL=https://apisprod.com/production

```

> **Nota:** El acceso a estas variables se encuentra estrictamente tipado y centralizado en `src/config/env.ts` para habilitar el autocompletado inteligente en el editor de código.

---

## 🏃‍♂️ Comandos de Ejecución

Una vez completada la configuración, utiliza los siguientes comandos en la terminal según tu flujo de trabajo:

| Acción | Comando | Descripción |
| --- | --- | --- |
| **Desarrollo** | `pnpm run dev` | Enciende el servidor local rápido con Vite usando las variables de `.env.development`. |
| **Producción** | `pnpm run build` | Compila, optimiza y empaqueta la app en la carpeta `/dist`, haciendo el switch automático a la URL del `.env.production`. |