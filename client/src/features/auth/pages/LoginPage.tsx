import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormLoginUsuarioFields,
  FormLoginUsuarioSchema,
} from "../schemas/FormLoginUsuarioSchema.ts";
import { Input } from "@/shared/components/form/Input.tsx";
import { cores } from "@/shared/constants/cores.ts";
import { useAuth } from "@/providers/AuthProvider.tsx";
import { isAxiosError } from "axios";

export const LoginPage = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormLoginUsuarioFields>({
    resolver: zodResolver(FormLoginUsuarioSchema),
  });

  const onSubmit = async (data: FormLoginUsuarioFields) => {
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
    <div
      className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: cores.background }}
    >
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8 space-y-4">
        <h1
          className="text-2xl font-medium text-center"
          style={{ color: cores.textPrimary }}
        >
          Entrar
        </h1>
        <p
          className="text-center text-sm"
          style={{ color: cores.textSecondary }}
        >
          Para continuar, faça login na sua conta
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            placeholder="Digite seu email"
            error={errors.email?.message}
            register={register("email")}
            focusColor={cores.primaryLighter}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            error={errors.senha?.message}
            register={register("senha")}
            focusColor={cores.primaryLighter}
          />

          <div className="flex justify-end text-sm">
            <Link
              to="/esqueceu-senha"
              style={{ color: cores.primary }}
              className="hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-white font-medium rounded-md transition-colors duration-200"
            style={{ backgroundColor: cores.primary }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = cores.primaryLight)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = cores.primary)
            }
            disabled={isSubmitting}
          >
            {isSubmitting ? "Carregando..." : "Entrar"}
          </button>

          {errors.root && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.root.message}
            </p>
          )}
        </form>

        <div className="text-center mt-2">
          <Link
            to="/cadastrar"
            style={{ color: cores.primary }}
            className="hover:underline text-sm"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
