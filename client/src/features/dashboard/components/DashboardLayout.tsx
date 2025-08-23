import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./navigation/DashboardHeader";
import { DashboardSidebar } from "./navigation/DashboardSidebar";

export default function DashboardLayout() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar desktop ou mobile */}
      {isDesktop ? <DashboardHeader /> : <DashboardSidebar />}

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col pt-16 md:pt-20">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
