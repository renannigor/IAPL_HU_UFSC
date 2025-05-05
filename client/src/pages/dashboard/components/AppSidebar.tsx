import {
  LayoutDashboard,
  UserCircle,
  Users2,
  Info,
  LogOut,
  User,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../components/AuthProvider";
import clsx from "clsx";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { usuarioAtual, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { label: "Início", path: "/dashboard", icon: LayoutDashboard },
    { label: "Pacientes", path: "/dashboard/pacientes", icon: UserCircle },
    ...(usuarioAtual?.admin
      ? [{ label: "Usuários", path: "/dashboard/usuarios", icon: Users2 }]
      : []),
    { label: "Perfil", path: "/dashboard/perfil", icon: User },
    { label: "Sobre", path: "/dashboard/sobre", icon: Info },
  ];

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col border-r border-gray-200 shadow-sm">
        {/* Topo */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <span
            className={`text-xl font-bold text-[#1F4D2C] overflow-hidden transition-all ${
              isCollapsed ? "w-0" : "w-auto"
            }`}
          >
            IAPL
          </span>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {isCollapsed ? <Menu /> : <ChevronLeft />}
          </button>
        </div>

        {/* Itens de navegação */}
        <ul className="flex-1 px-3 mt-2 text-gray-800">
          {menuItems.map(({ label, path, icon: Icon }) => {
            const active = isActive(path);
            return (
              <li
                key={path}
                onClick={() => (window.location.href = path)}
                className={clsx(
                  "relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group",
                  active
                    ? "bg-[#1F4D2C]/10 text-[#1F4D2C]"
                    : "hover:bg-[#1F4D2C]/10 text-gray-700"
                )}
              >
                <Icon size={20} />
                <span
                  className={clsx(
                    "overflow-hidden transition-all",
                    isCollapsed ? "w-0" : "w-52 ml-3"
                  )}
                >
                  {label}
                </span>
                {isCollapsed && (
                  <div
                    className={clsx(
                      "absolute left-full rounded-md px-2 py-1 ml-6 bg-[#1F4D2C]/90 text-white text-sm",
                      "invisible opacity-0 -translate-x-3 transition-all",
                      "group-hover:visible group-hover:opacity-100 group-hover:translate-x-0"
                    )}
                  >
                    {label}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Botão de logout */}
        <ul className="px-3 pb-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-red-100 transition">
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span>Sair</span>}
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja sair?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Você será desconectado do sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={logout}>Sair</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ul>

        {/* Rodapé - informações do usuário */}
        <div className="border-t border-gray-200 px-3 py-3 flex items-center">
          <div className="w-10 h-10 bg-[#1F4D2C] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
            {usuarioAtual?.nome?.charAt(0).toUpperCase() || "U"}
          </div>
          <div
            className={`overflow-hidden transition-all ${
              isCollapsed ? "w-0" : "w-52 ml-3"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-sm">{usuarioAtual?.nome}</h4>
              <span className="text-xs text-gray-500">
                {usuarioAtual?.email}
              </span>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
