import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Erro404Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl min-h-screen bg-white p-16 flex flex-col justify-center overflow-y-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full">
            <AlertTriangle className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Página não encontrada
        </h2>
        <p className="text-gray-500 text-center mt-2">
          Opa! Parece que você tentou acessar uma página que não existe ou foi
          movida.
        </p>
        <Link
          to="/"
          className="mt-6 h-12 w-full bg-[#1F4D2C] text-white p-2 rounded-md text-center hover:bg-[#173B21] transition"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  );
};

export default Erro404Page;
