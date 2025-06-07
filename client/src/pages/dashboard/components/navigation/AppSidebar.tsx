import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
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

type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

type AppSidebarProps = {
  menuItems: MenuItem[];
};

export function AppSidebar({ menuItems }: AppSidebarProps) {
  const { pathname } = useLocation();
  const { usuarioAtual, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Botão que abre o drawer */}
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
        <Menu />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="h-full flex flex-col border-r border-gray-200">
          {/* Topo */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <span className="text-xl font-bold text-[#1F4D2C]">IAPL</span>
            <button
              onClick={closeSidebar}
              className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              <X />
            </button>
          </div>

          {/* Itens de navegação */}
          <ul className="flex-1 px-3 mt-2 text-gray-800">
            {menuItems.map(({ title, url, icon: Icon }) => {
              const active = isActive(url);
              return (
                <li
                  key={url}
                  onClick={() => {
                    window.location.href = url;
                    closeSidebar();
                  }}
                  className={clsx(
                    "flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors",
                    active
                      ? "bg-[#1F4D2C]/10 text-[#1F4D2C]"
                      : "hover:bg-[#1F4D2C]/10 text-gray-700"
                  )}
                >
                  <Icon size={20} className="mr-3" />
                  <span>{title}</span>
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
                  <span>Sair</span>
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

          {/* Rodapé */}
          <div className="border-t border-gray-200 px-3 py-3 flex items-center">
            <div className="w-10 h-10 bg-[#1F4D2C] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
              {usuarioAtual?.nome?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-3">
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
    </>
  );
}
