import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import { NeveraFilterProvider } from "../features/dashboard/contexts/NeveraFilterContext";
import DashboardHeader from "../features/dashboard/components/DashboardHeader";

export default function DashboardLayout() {
  
  return (
    <NeveraFilterProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 relative">
          <DashboardHeader userName="Roberto" />
          <main className="flex-1 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </NeveraFilterProvider>
  );
}