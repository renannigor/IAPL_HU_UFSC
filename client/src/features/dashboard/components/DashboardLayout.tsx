import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { menuItems } from "../repository/MenuItems";
import { DashboardHeader } from "./navigation/DashboardHeader";
import { DashboardSidebar } from "./navigation/DashboardSidebar";

export default function DashboardLayout() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar desktop ou mobile */}
      {isDesktop ? (
        <DashboardHeader />
      ) : (
        <DashboardSidebar menuItems={menuItems} />
      )}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col pt-16 md:pt-20">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
