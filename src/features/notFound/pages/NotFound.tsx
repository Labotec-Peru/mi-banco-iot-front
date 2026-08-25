
import { useNavigate } from "react-router-dom";

import { Button } from "@heroui/react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <span className="text-9xl font-extrabold text-zinc-200 dark:text-zinc-600 tracking-widest select-none">
        404
      </span>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
        Página no encontrada
      </h1>

      <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-400 max-w-md">
        Lo sentimos, no pudimos encontrar la página que estás buscando. Es
        posible que haya sido movida o eliminada.
      </p>

      <div className="mt-10">
        <Button
          onPress={() => navigate("/dashboard")}
          color="primary"
          startContent={<svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
