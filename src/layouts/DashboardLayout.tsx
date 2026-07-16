import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import DashboardTabs from "../components/layout/DashboardTabs";

export default function DashboardLayout() {
  const location = useLocation();
  const isSensorsPage = location.pathname.replace(/\/$/, "") === "/sensores";
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      {!isSensorsPage && <DashboardTabs />}
      <div className="flex flex-col flex-1 min-w-0 relative">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}