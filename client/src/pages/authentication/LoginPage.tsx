import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormFields, LoginFormSchema } from "../../schemas/loginSchema";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import AuthNavCard from "./components/AuthNavCard";
import LabelInput from "./components/LabelInput";
import LabelPasswordInput from "./components/LabelPasswordInput";

const LoginPage = () => {
  const {
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormFields>({
    resolver: zodResolver(LoginFormSchema),
  });

  const { login } = useAuth();

  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    try {
      await login(data.email, data.senha);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.error || "Erro ao fazer o login."
        : "Erro inesperado. Tente novamente.";

      setError("root", { message: errorMessage });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl min-h-screen bg-white p-16 flex flex-col justify-center overflow-y-auto">
        {/* Título e subtítulo */}
        <div className="text-left mb-6">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-gray-600">
            Olá, preencha suas informações para fazer login em sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <LabelInput
            id="email"
            label="Email"
            register={control.register("email")}
            error={errors.email?.message}
            placeholder="Seu email"
            type="email"
            className="h-12 w-full border p-2 rounded-md"
            labelClassName="block font-medium mb-1"
            errorClassName="text-red-500 text-sm mt-1"
          />

          <LabelPasswordInput
            id="senha"
            label="Senha"
            register={control.register("senha")}
            error={errors.senha?.message}
            placeholder="Sua senha"
            inputClassName="h-12 w-full border p-2 rounded-md"
            labelClassName="block font-medium mb-1"
            errorClassName="text-red-500 text-sm mt-1"
          />

          <Button
            type="submit"
            className="h-12 w-full bg-[#1F4D2C] text-white p-2 rounded-md hover:bg-[#173B21] transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Carregando..." : "Entrar"}
          </Button>

          <div className="text-right text-sm text-gray-500 mt-2">
            <Link to="/esqueceu-senha" className="hover:underline">
              Você esqueceu sua senha?
            </Link>
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.root.message}
            </p>
          )}
        </form>

        <AuthNavCard
          title="Cadastro"
          subtitle="Você ainda não tem uma conta?"
          buttonText="Criar conta"
          linkTo="/cadastrar"
        />
      </div>
    </div>
  );
};

export default LoginPage;
