import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  CadastroUsuarioFields,
  CadastroUsuarioFormSchema,
} from "../../schemas/CadastroUsuarioSchema";
import { obterEndereco } from "../../services/EnderecoService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "../../components/auth/AuthProvider";
import { isAxiosError } from "axios";
import { Button } from "@/components/ui/button";
import AuthNavCard from "./components/AuthNavCard";
import Editor from "../../components/shared/Editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Utilitarios } from "@/utils/utilitarios";

const CadastroUsuarioPage = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CadastroUsuarioFields>({
    resolver: zodResolver(CadastroUsuarioFormSchema),
  });

  const { cadastrarUsuario } = useAuth();
  const [isReadOnly, setIsReadOnly] = useState(true);

  const onSubmit: SubmitHandler<CadastroUsuarioFields> = async (data) => {
    try {
      await cadastrarUsuario(
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
        data.numeroResidencial
      );
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error || "Erro ao fazer o cadastro."
        : "Erro inesperado. Tente novamente.";
      setError("root", { message });
    }
  };

  const verificaMudancaCep = async (cep: string) => {
    if (!cep || cep.length !== 8) {
      setError("cep", { message: "CEP inválido" });
      redefinirCamposEndereco();
      return;
    }

    try {
      const endereco = await obterEndereco(cep);
      if (!endereco) {
        setError("cep", { message: "CEP não encontrado" });
        redefinirCamposEndereco();
      } else {
        setValue("logradouro", endereco.logradouro);
        setValue("bairro", endereco.bairro);
        setValue("cidade", endereco.cidade);
        setValue("estado", endereco.uf);
        setIsReadOnly(false);
      }
    } catch {
      setError("cep", { message: "Erro ao buscar CEP" });
      redefinirCamposEndereco();
    }
  };

  const redefinirCamposEndereco = () => {
    setValue("logradouro", "");
    setValue("bairro", "");
    setValue("cidade", "");
    setValue("estado", "");
    setIsReadOnly(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-4xl min-h-screen bg-white p-16 flex flex-col justify-center overflow-y-auto">
        {/* Título */}
        <div className="text-left mb-6">
          <h1 className="text-3xl font-bold">Cadastro</h1>
          <p className="text-gray-600">
            Preencha suas informações para criar uma conta.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Editor
              id="nome"
              label="Nome"
              ehCampoSenha={false}
              register={register("nome")}
              error={errors.nome?.message}
              placeholder="Seu nome completo"
              className="h-12 w-full border p-2 rounded-md"
            />

            <Editor
              id="email"
              label="Email"
              ehCampoSenha={false}
              register={register("email")}
              error={errors.email?.message}
              placeholder="exemplo@email.com"
              className="h-12 w-full border p-2 rounded-md"
              type="email"
            />

            <div className="flex flex-col">
              <label className="block font-medium mb-1 text-sm">Sou:</label>
              <Controller
                control={control}
                name="tipoUsuario"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="min-h-[48px] w-full border p-2 rounded-md">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Utilitarios.tiposUsuarios.map((tipo, index) => (
                        <SelectItem key={index} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipoUsuario && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.tipoUsuario.message}
                </p>
              )}
            </div>

            <Editor
              id="cpf"
              label="CPF"
              ehCampoSenha={false}
              register={register("cpf")}
              error={errors.cpf?.message}
              placeholder="Apenas números"
              className="h-12 w-full border p-2 rounded-md"
              maxLength={11}
            />

            <Editor
              id="cep"
              label="CEP"
              ehCampoSenha={false}
              register={register("cep")}
              error={errors.cep?.message}
              placeholder="Somente números"
              maxLength={8}
              className="h-12 w-full border p-2 rounded-md"
              onChange={(e) => verificaMudancaCep(e.target.value)}
            />

            <Editor
              id="numeroResidencial"
              label="Número"
              ehCampoSenha={false}
              register={register("numeroResidencial")}
              error={errors.numeroResidencial?.message}
              placeholder="Ex: 83"
              className="h-12 w-full border p-2 rounded-md"
              min={1}
            />

            <Editor
              id="logradouro"
              label="Rua"
              ehCampoSenha={false}
              register={register("logradouro")}
              error={errors.logradouro?.message}
              placeholder="Sua rua"
              className="h-12 w-full border p-2 rounded-md"
              readOnly={isReadOnly}
            />

            <Editor
              id="bairro"
              label="Bairro"
              ehCampoSenha={false}
              register={register("bairro")}
              error={errors.bairro?.message}
              placeholder="Seu bairro"
              className="h-12 w-full border p-2 rounded-md"
              readOnly={isReadOnly}
            />

            <Editor
              id="cidade"
              label="Cidade"
              ehCampoSenha={false}
              register={register("cidade")}
              error={errors.cidade?.message}
              placeholder="Sua cidade"
              className="h-12 w-full border p-2 rounded-md"
              readOnly={isReadOnly}
            />

            <Editor
              id="estado"
              label="Estado"
              ehCampoSenha={false}
              register={register("estado")}
              error={errors.estado?.message}
              placeholder="Seu estado"
              className="h-12 w-full border p-2 rounded-md"
              readOnly={isReadOnly}
            />

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
          </div>

          {errors.root && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            className="h-12 w-full bg-[#1F4D2C] text-white p-2 rounded-md hover:bg-[#173B21] transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </form>

        <AuthNavCard
          title="Login"
          subtitle="Você já tem uma conta?"
          buttonText="Voltar ao Login"
          linkTo="/entrar"
        />
      </div>
    </div>
  );
};

export default CadastroUsuarioPage;
