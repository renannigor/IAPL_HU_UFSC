import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { cores } from "@/shared/constants/cores";

export const Erro404Page = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: cores.background }}
    >
      <div className="bg-white rounded-xl shadow-md p-12 text-center max-w-md w-full space-y-4">
        <AlertCircle size={64} color={cores.primary} className="mx-auto" />
        <h1 className="text-6xl font-bold" style={{ color: cores.primary }}>
          404
        </h1>
        <p className="text-lg" style={{ color: cores.textSecondary }}>
          Ops! Página não encontrada.
        </p>
        <Link
          to="/entrar"
          className="inline-block px-6 py-2 rounded-md text-white font-medium transition-colors duration-200"
          style={{ backgroundColor: cores.primary }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = cores.primaryLight)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = cores.primary)
          }
        >
          Voltar para Login
        </Link>
      </div>
    </div>
  );
};

export default Erro404Page;
