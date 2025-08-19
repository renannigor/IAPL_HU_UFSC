import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { cores } from "@/shared/constants/cores.ts";
import { useAuth } from "@/providers/AuthProvider.tsx";
import {
  FormCadastroUsuarioFields,
  FormCadastroUsuarioSchema,
} from "../schemas/FormCadastroUsuarioSchema.ts";
import { isAxiosError } from "axios";
import { Input } from "@/shared/components/form/Input.tsx";
import UsuarioService from "@/features/usuarios/services/UsuarioService.ts";
import { Opcao } from "@/types/Opcao.ts";
import { Select } from "@/shared/components/form/Select.tsx";
import EnderecoService from "@/features/usuarios/services/EnderecoService.ts";

export const CadastroUsuarioPage = () => {
  const { cadastro } = useAuth();
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [tiposUsuario, setTiposUsuario] = useState<Opcao[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormCadastroUsuarioFields>({
    resolver: zodResolver(FormCadastroUsuarioSchema),
  });

  // Carregando os tipos de usuários
  useEffect(() => {
    const fetchTiposUsuario = async () => {
      const tipos = await UsuarioService.getTiposUsuario();
      setTiposUsuario(tipos);
    };
    fetchTiposUsuario();
  }, []);

  const onSubmit = async (data: FormCadastroUsuarioFields) => {
    try {
      await cadastro(
        data.cpf,
        data.nome,
        data.email,
        data.tipoUsuario,
        data.senha,
        data.cep,
        data.logradouro,
        data.bairro,
        data.cidade,
        data.estado,
        data.numeroResidencial!
      );
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error || "Erro ao fazer o cadastro."
        : "Erro inesperado. Tente novamente.";
      setError("root", { message });
    }
  };

  const redefinirCamposEndereco = () => {
    setValue("logradouro", "");
    setValue("bairro", "");
    setValue("cidade", "");
    setValue("estado", "");
    setIsReadOnly(true);
  };

  const verificaMudancaCep = async (cep: string) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (!cepLimpo || cepLimpo.length !== 8) {
      setError("cep", { message: "CEP inválido" });
      redefinirCamposEndereco();
      return;
    }

    const endereco = await EnderecoService.obterEndereco(cepLimpo);
    if (!endereco) {
      setError("cep", { message: "CEP não encontrado" });
      redefinirCamposEndereco();
    } else {
      setValue("logradouro", endereco.logradouro || "");
      setValue("bairro", endereco.bairro || "");
      setValue("cidade", endereco.localidade || "");
      setValue("estado", endereco.uf || "");
      setIsReadOnly(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: cores.background }}
    >
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 space-y-4">
        <h1
          className="text-2xl font-medium text-center"
          style={{ color: cores.textPrimary }}
        >
          Cadastro
        </h1>
        <p
          className="text-center text-sm"
          style={{ color: cores.textSecondary }}
        >
          Preencha os dados abaixo para criar sua conta
        </p>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log(errors);
          })}
        >
          <Input
            label="Nome"
            placeholder="Digite seu nome"
            error={errors.nome?.message}
            register={register("nome")}
            focusColor={cores.primaryLighter}
          />
          <Select
            label="Sou"
            options={tiposUsuario}
            error={errors.tipoUsuario?.message}
            register={register("tipoUsuario")}
          />
          <Input
            label="Email"
            placeholder="Digite seu email"
            error={errors.email?.message}
            register={register("email")}
            focusColor={cores.primaryLighter}
          />
          <Input
            label="CPF"
            placeholder="Digite seu CPF"
            error={errors.cpf?.message}
            register={register("cpf")}
            focusColor={cores.primaryLighter}
          />
          <Input
            label="CEP"
            placeholder="Digite seu CEP"
            error={errors.cep?.message}
            register={register("cep")}
            focusColor={cores.primaryLighter}
            onBlur={(e) => verificaMudancaCep(e.target.value)}
            maxLength={8}
          />
          <Input
            label="Logradouro"
            placeholder="Digite seu logradouro"
            error={errors.logradouro?.message}
            register={register("logradouro")}
            focusColor={cores.primaryLighter}
            disabled={isReadOnly}
          />
          <Input
            label="Bairro"
            placeholder="Digite seu bairro"
            error={errors.bairro?.message}
            register={register("bairro")}
            focusColor={cores.primaryLighter}
            disabled={isReadOnly}
          />
          <Input
            label="Cidade"
            placeholder="Digite sua cidade"
            error={errors.cidade?.message}
            register={register("cidade")}
            focusColor={cores.primaryLighter}
            disabled={isReadOnly}
          />
          <Input
            label="Estado"
            placeholder="Digite seu estado"
            error={errors.estado?.message}
            register={register("estado")}
            focusColor={cores.primaryLighter}
            disabled={isReadOnly}
          />
          <Input
            label="Número residencial (opcional)"
            placeholder="Digite o número da residência"
            error={errors.numeroResidencial?.message}
            register={register("numeroResidencial")}
            focusColor={cores.primaryLighter}
          />
          <Input
            label="Senha"
            placeholder="Digite sua senha"
            type="password"
            error={errors.senha?.message}
            register={register("senha")}
            focusColor={cores.primaryLighter}
          />
          <Input
            label="Confirmar senha"
            placeholder="Confirme sua senha"
            type="password"
            error={errors.confirmarSenha?.message}
            register={register("confirmarSenha")}
            focusColor={cores.primaryLighter}
          />

          <div className="md:col-span-2">
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
              {isSubmitting ? "Carregando..." : "Cadastrar"}
            </button>

            {errors.root && (
              <p className="text-red-500 text-sm text-center mt-2">
                {errors.root.message}
              </p>
            )}
          </div>
        </form>

        <div className="text-center mt-2 md:col-span-2">
          <Link
            to="/entrar"
            style={{ color: cores.primary }}
            className="hover:underline text-sm"
          >
            Já tem conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CadastroUsuarioPage;
