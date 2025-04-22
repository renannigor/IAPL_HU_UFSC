import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";

const NoAccessPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout(); // Faz o logout
    navigate("/entrar"); // Redireciona manualmente
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl min-h-screen bg-white p-16 flex flex-col justify-center overflow-y-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a6 6 0 00-6 6v1H3a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-1V8a6 6 0 00-6-6zm-4 7V8a4 4 0 118 0v1H6zm-2 2h12v6H4v-6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Você não tem permissão para acessar esta seção
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Sua solicitação de acesso ao sistema foi enviada para análise. Aguarde
          a liberação de acesso pelo administrador.
        </p>
        <button
          className="mt-6 h-12 w-full bg-[#1F4D2C] text-white p-2 rounded-md hover:bg-[#173B21] transition"
          onClick={handleLogout}
        >
          Voltar ao Formulário
        </button>
      </div>
    </div>
  );
};

export default NoAccessPage;
