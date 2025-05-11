import { SubmitHandler, useForm } from "react-hook-form";
import {
  RedefinirSenhaFormFields,
  RedefinirSenhaFormSchema,
} from "../../schemas/RedefinirSenhaSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthProvider";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import Editor from "../../components/shared/Editor";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const RedefinirSenhaPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm<RedefinirSenhaFormFields>({
    resolver: zodResolver(RedefinirSenhaFormSchema),
  });

  const { redefinirSenha } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate("/entrar"); // Redireciona apenas se o token não estiver presente
    }
  }, [token, navigate]);

  const onSubmit: SubmitHandler<RedefinirSenhaFormFields> = async (data) => {
    try {
      if (token) {
        await redefinirSenha(data.senha, token);
      }
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.error || "Erro ao atualizar senha."
        : "Erro inesperado. Tente novamente.";

      setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl min-h-screen bg-white p-16 flex flex-col justify-center overflow-y-auto">
        <div className="text-left mb-6">
          <h1 className="text-3xl font-bold">Alterar Minha Senha</h1>
          <p className="text-gray-600">
            Por favor, digite sua nova senha para ser realizado a atualização.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Editor
            id="senha"
            label="Senha"
            ehCampoSenha={true}
            register={register("senha")}
            error={errors.senha?.message}
            placeholder="Sua senha"
            inputClassName="h-12 w-full border p-2 rounded-md"
            labelClassName="block font-medium mb-1"
          />

          <Editor
            id="confirmarSenha"
            label="Confirmar senha"
            ehCampoSenha={true}
            register={register("confirmarSenha")}
            error={errors.confirmarSenha?.message}
            placeholder="Repetir senha"
            inputClassName="h-12 w-full border p-2 rounded-md"
            labelClassName="block font-medium mb-1"
          />

          <Button
            type="submit"
            className="h-12 w-full bg-[#1F4D2C] text-white p-2 rounded-md hover:bg-[#173B21] transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Carregando..." : "Alterar Minha Senha"}
          </Button>

          {errors.root && (
            <p className="text-red-500 text-sm text-center">
              {errors.root.message}
            </p>
          )}
        </form>

        <div className="mt-6 text-sm text-gray-500 text-center space-x-4">
          <Link to="/entrar" className="hover:underline text-[#1F4D2C]">
            Ir para o Login
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/cadastrar" className="hover:underline text-[#1F4D2C]">
            Registrar-se
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RedefinirSenhaPage;
