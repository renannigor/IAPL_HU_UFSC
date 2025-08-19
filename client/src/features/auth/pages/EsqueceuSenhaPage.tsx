import { Link, useNavigate } from "react-router-dom";
import { cores } from "@/shared/constants/cores";

export const EsqueceuSenhaPage = () => {
  const navigate = useNavigate();

  const handleRedefinir = () => {
    // Redireciona para outro site
    window.open("https://exemplo.com/redefinir-senha", "_blank");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: cores.background }}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">
        <h1
          className="text-2xl font-medium text-center"
          style={{ color: cores.textPrimary }}
        >
          Esqueceu sua senha?
        </h1>
        <p
          className="text-center text-sm"
          style={{ color: cores.textSecondary }}
        >
          Você será redirecionado para um site externo para modificar sua senha.
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleRedefinir}
            className="w-full py-2 px-4 text-white font-medium rounded-md transition-colors duration-200"
            style={{ backgroundColor: cores.primary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = cores.primaryLight)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = cores.primary)
            }
          >
            Redefinir senha
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-2 px-4 font-medium rounded-md transition-colors duration-200 border"
            style={{
              color: cores.primary,
              borderColor: cores.primary,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = cores.primaryLighter)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Voltar
          </button>
        </div>

        <div className="text-center">
          <Link
            to="/entrar"
            style={{ color: cores.primary }}
            className="hover:underline text-sm"
          >
            Lembrado da senha? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EsqueceuSenhaPage;
