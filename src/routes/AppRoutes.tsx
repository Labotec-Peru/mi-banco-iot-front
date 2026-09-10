import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import Neveras from "@/features/dashboard/pages/Neveras";
import Jasper from "@/features/dashboard/pages/Jasper";
import NotFound from "@/features/notFound/pages/NotFound";
import Sensores from "@/features/devices/pages/Sensores";
import Alerts from "@/features/alerts/pages/Alerts";
import Users from "@/features/users/page/Users";
import Medidores from "@/features/medidores/page/Medidores";
import Comandos from "@/features/command/pages/Comandos";
import Modelos from "@/features/medidores/page/Modelos";
import Marcas from "@/features/medidores/page/Marcas";
import Tipos from "@/features/medidores/page/Tipos";
import Companies from "@/features/company/page/Company";
import TecnologiasRed from "@/features/network/page/TecnologiasRed";
import SensorInstall from "@/features/devices/pages/SensorInstall";
import Attachments from "@/features/attachment/pages/Attachments";
import Lecturas from "@/features/graph/page/Lecturas";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>

          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/neveras" element={<Neveras />} />
            <Route path="/dashboard/jasper" element={<Jasper />} />
            <Route path="/sensores" element={<Sensores />} />
            <Route path="/instalacion" element={<SensorInstall />} />
            <Route path="/alertas" element={<Alerts />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/medidores" element={<Medidores />} />
            <Route path="/modelos" element={<Modelos />} />
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/tipos" element={<Tipos />} />
            <Route path="/graph" element={<Lecturas />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/command" element={<Comandos />} />
            <Route path="/network" element={<TecnologiasRed />} />
            <Route path="/attachmen" element={<Attachments />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
