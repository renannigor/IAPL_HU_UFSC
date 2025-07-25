import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/pages/dashboard/components/navigation/AppSidebar";
import { BottomNavigation } from "@/pages/dashboard/components/navigation/BottomNavigation";
import { Home, Info, Users2, UserCircle } from "lucide-react";

export default function DashboardLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Pacientes", url: "/dashboard/pacientes", icon: Users2 },
    { title: "Perfil", url: "/dashboard/perfil", icon: UserCircle },
    { title: "Sobre", url: "/dashboard/sobre", icon: Info },
  ];

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

      {isMobile && <BottomNavigation menuItems={menuItems} />}
    </div>
  );
}
