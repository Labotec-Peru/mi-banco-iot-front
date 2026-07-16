import PageContainer from "../../../layouts/PageContainer";
import { useNavigate } from "react-router-dom";

import { Button } from "@heroui/react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <span className="text-9xl font-extrabold text-blue-600/20 tracking-widest select-none">
          404
        </span>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Página no encontrada
        </h1>

        <p className="mt-6 text-base leading-7 text-gray-600 max-w-md">
          Lo sentimos, no pudimos encontrar la página que estás buscando. Es
          posible que haya sido movida o eliminada.
        </p>

        <div className="mt-10">
          <Button
            onPress={() => navigate("/dashboard")}
            color="primary"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
