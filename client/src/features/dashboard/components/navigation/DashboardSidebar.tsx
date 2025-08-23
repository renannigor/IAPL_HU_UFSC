import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cores } from "@/shared/constants/cores";
import { useAuth } from "@/providers/AuthProvider";
import { dashboardLinks } from "../../repository/dashboardLinks";

export function DashboardSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { usuarioAtual, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (url: string) => pathname === url;

  return (
    <>
      {/* Botão menu mobile */}
      <button
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 md:hidden fixed top-4 left-4 z-50"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </button>

      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:shadow-none flex flex-col justify-between`}
      >
        {/* Logo e fechar */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <span
            className="text-xl font-bold cursor-pointer"
            style={{ color: cores.primary }}
            onClick={() => navigate("/")}
          >
            IAPL
          </span>
          <button
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Links do menu */}
        <ul className="flex-1 px-3 mt-2">
          {dashboardLinks.map(({ to, label, icon: Icon }) => (
            <li
              key={to}
              onClick={() => {
                navigate(to);
                setSidebarOpen(false);
              }}
              className={`flex items-center py-2 px-3 my-1 rounded-md cursor-pointer transition-colors ${
                isActive(to)
                  ? `bg-[${cores.primaryLighter}] text-[${cores.primary}]`
                  : `hover:bg-[${cores.primaryLighter}] text-gray-700`
              }`}
            >
              <Icon size={20} className={`mr-3 text-[${cores.primary}]`} />
              {label}
            </li>
          ))}
        </ul>

        {/* Info do usuário + logout */}
        {usuarioAtual && (
          <div className="px-3 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md"
                style={{ backgroundColor: cores.primary }}
              >
                {usuarioAtual.nome?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="leading-4">
                <h4 className="font-semibold text-sm">{usuarioAtual.nome}</h4>
                <span className="text-xs text-gray-500">
                  {usuarioAtual.email}
                </span>
              </div>
            </div>
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={logout}
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
