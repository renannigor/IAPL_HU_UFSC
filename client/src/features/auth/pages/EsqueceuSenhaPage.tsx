import { Link } from "react-router-dom";
import { Button } from "@/ui/button";

const EsqueceuSenhaPage = () => {
  const redirectToExternalSite = () => {
    window.location.href = "https://site-externo-para-redefinir-senha.com"; // coloque a URL correta aqui
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl min-h-screen bg-white p-16 flex flex-col justify-center overflow-y-auto">
        <div className="text-left mb-6">
          <h1 className="text-3xl font-bold">Recuperar senha</h1>
          <p className="text-gray-600">
            Você será redirecionado para um site externo para modificar sua
            senha.
          </p>
        </div>

        <div className="space-y-6">
          <Button
            type="button"
            className="h-12 w-full bg-[#1F4D2C] text-white p-2 rounded-md hover:bg-[#173B21] transition"
            onClick={redirectToExternalSite}
          >
            Redefinir senha
          </Button>
        </div>

        <div className="text-right text-sm text-gray-500 mt-4">
          <Link
            to="/entrar"
            className="h-12 w-full bg-green-100 text-[#1F4D2C] font-medium rounded-md hover:bg-green-200 transition flex items-center justify-center"
          >
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EsqueceuSenhaPage;
