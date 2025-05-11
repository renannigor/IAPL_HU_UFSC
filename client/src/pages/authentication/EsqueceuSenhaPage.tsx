import { SubmitHandler, useForm } from "react-hook-form";
import {
  EsqueceuSenhaFormFields,
  EsqueceuSenhaFormSchema,
} from "../../schemas/EsqueceuSenhaSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/auth/AuthProvider";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import Editor from "../../components/shared/Editor";

const EsqueceuSenhaPage = () => {
  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm<EsqueceuSenhaFormFields>({
    resolver: zodResolver(EsqueceuSenhaFormSchema),
  });

  const { esqueceuSenha } = useAuth();

  const onSubmit: SubmitHandler<EsqueceuSenhaFormFields> = async (data) => {
    try {
      await esqueceuSenha(data.email);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.error || "Erro ao enviar email."
        : "Erro inesperado. Tente novamente.";

      setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl min-h-screen bg-white p-16 flex flex-col justify-center overflow-y-auto">
        <div className="text-left mb-6">
          <h1 className="text-3xl font-bold">Recuperar senha</h1>
          <p className="text-gray-600">
            Por favor, digite seu e-mail para receber instruções de redefinição
            de senha.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Editor
            id="email"
            label="Email"
            ehCampoSenha={false}
            register={register("email")}
            error={errors.email?.message}
            placeholder="Seu email"
            className="h-12 w-full border p-2 rounded-md"
            type="email"
          />

          <Button
            type="submit"
            className="h-12 w-full bg-[#1F4D2C] text-white p-2 rounded-md hover:bg-[#173B21] transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Carregando..." : "Enviar Instruções"}
          </Button>

          {errors.root && (
            <p className="text-red-500 text-sm text-center">
              {errors.root.message}
            </p>
          )}
        </form>

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
