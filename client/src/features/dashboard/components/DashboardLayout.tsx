import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/features/dashboard/components/navigation/AppSidebar";
import { menuItems } from "../utils/MenuItems";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col bg-gray-50">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-20 flex items-center px-4">
        <AppSidebar menuItems={menuItems} />
      </header>

      {/* Conteúdo principal abaixo do header */}
      <div className="flex flex-1 pt-16 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
