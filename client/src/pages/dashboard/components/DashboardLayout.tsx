import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/pages/dashboard/components/navigation/AppSidebar";
import { BottomNavigation } from "@/pages/dashboard/components/navigation/BottomNavigation";
import { useAuth } from "@/components/auth/AuthProvider";

import { Home, Info, User, Users2, UserCircle } from "lucide-react";

export default function DashboardLayout() {
  const { usuarioAtual } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseItems = [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Pacientes", url: "/dashboard/pacientes", icon: User },
    { title: "Perfil", url: "/dashboard/perfil", icon: UserCircle },
    { title: "Sobre", url: "/dashboard/sobre", icon: Info },
  ];

  const menuItems = usuarioAtual?.admin
    ? [
        ...baseItems,
        { title: "Usuários", url: "/dashboard/usuarios", icon: Users2 },
      ]
    : baseItems;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {!isMobile && <AppSidebar menuItems={menuItems} />}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50 mb-14 md:mb-0">
        <Outlet />
      </main>
      {isMobile && <BottomNavigation menuItems={menuItems} />}
    </div>
  );
}
