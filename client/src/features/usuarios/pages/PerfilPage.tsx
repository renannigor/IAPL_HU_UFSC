import { useEffect, useState } from "react";
import Editor from "@/shared/components/form/Editor";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PerfilUsuarioFields,
  PerfilUsuarioSchema,
} from "@/features/usuarios/schemas/PerfilUsuarioSchema";
import { isAxiosError } from "axios";
import UsuarioService from "@/features/usuarios/services/UsuarioService";
import { BreadcrumbNav } from "@/shared/components/layout/BreadcrumbNav";
import AuthService from "@/features/auth/services/AuthService";
import { Usuario } from "../types/Usuario";
import { obterEndereco } from "../services/EnderecoService";

const PerfilPage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [usuario, setUsuario] = useState<Usuario>();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerfilUsuarioFields>({
    resolver: zodResolver(PerfilUsuarioSchema),
  });

  const carregarUsuario = async () => {
    const dados = await AuthService.getUsuarioAtual();
    console.log("DADOSS: ", dados.user)
    setUsuario(dados.user);
    reset({
      nome: dados.user.nome || "",
      tipo: dados.user.tipo || "",
      email: dados.user.email || "",
      ultimo_acesso: dados.user.ultimo_acesso || "",
      cep: dados.user.cep || "",
      logradouro: dados.user.logradouro || "",
      bairro: dados.user.bairro || "",
      cidade: dados.user.cidade || "",
      estado: dados.user.estado || "",
      numeroResidencial: dados.user.numero || 0,
    });
  };

  // Carregar dados iniciais
  useEffect(() => {
    carregarUsuario();
  }, [reset]);

  if (!usuario) {
    return (
      <div className="p-6 text-gray-500">Carregando dados do usuário...</div>
    );
  }

  const firstLetter = usuario?.nome?.charAt(0).toUpperCase() || "?";

  const onSubmit: SubmitHandler<PerfilUsuarioFields> = async (data) => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      await UsuarioService.atualizarPerfil(usuario?.cpf!, data);
      await carregarUsuario();
      setIsEditing(false);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.error ||
          "Erro ao atualizar informações pessoais"
        : "Erro inesperado. Tente novamente.";
      setError("root", { message: errorMessage });
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 w-full max-w-full px-6 py-8 bg-white rounded shadow"
    >
      <BreadcrumbNav
        itens={[
          { titulo: "Home", href: "/" },
          { titulo: "Perfil", href: "/dashboard/perfil" },
        ]}
      />

      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-2xl font-semibold text-green-800">
          {firstLetter}
        </div>
        <div>
          <p className="text-lg font-semibold">{usuario?.nome}</p>
          <p className="text-sm text-muted-foreground">{usuario?.email}</p>
        </div>
      </div>

      <div className="space-y-10">
        {/* Sessão - Informações Pessoais */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Informações Pessoais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Editor
              id="nome"
              label="Nome Completo"
              register={register("nome")}
              error={errors.nome?.message}
              disabled={!isEditing}
              ehCampoSenha={false}
              placeholder="Seu nome"
              inputClassName={`h-12 w-full border p-2 rounded-md ${
                !isEditing ? "bg-gray-100" : "bg-white"
              }`}
            />
            <Editor
              id="email"
              label="Email"
              register={register("email")}
              error={errors.email?.message}
              ehCampoSenha={false}
              disabled
              placeholder="Seu email"
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="tipo"
              label="Tipo de Usuário"
              register={register("tipo")}
              error={errors.tipo?.message}
              ehCampoSenha={false}
              disabled
              placeholder="Tipo de usuário"
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
            <Editor
              id="ultimo_acesso"
              label="Último Acesso"
              register={register("ultimo_acesso")}
              ehCampoSenha={false}
              error={errors.ultimo_acesso?.message}
              disabled
              placeholder="Seu último acesso"
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
          </div>
        </section>

        {/* Sessão - Endereço */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Editor
              id="cep"
              label="CEP"
              register={register("cep")}
              error={errors.cep?.message}
              disabled={!isEditing}
              ehCampoSenha={false}
              maxLength={8}
              onChange={(e) => verificaMudancaCep(e.target.value)}
              placeholder="Seu CEP"
              inputClassName={`h-12 w-full border p-2 rounded-md ${
                !isEditing ? "bg-gray-100" : "bg-white"
              }`}
            />
            <Editor
              id="logradouro"
              label="Logradouro"
              register={register("logradouro")}
              error={errors.logradouro?.message}
              ehCampoSenha={false}
              disabled={isEditing ? isReadOnly : true}
              placeholder="Seu Logradouro"
              inputClassName={`h-12 w-full border p-2 rounded-md ${
                isReadOnly ? "bg-gray-100" : "bg-white"
              }`}
            />
            <Editor
              id="bairro"
              label="Bairro"
              register={register("bairro")}
              error={errors.bairro?.message}
              ehCampoSenha={false}
              disabled={isEditing ? isReadOnly : true}
              placeholder="Seu Bairro"
              inputClassName={`h-12 w-full border p-2 rounded-md ${
                isReadOnly ? "bg-gray-100" : "bg-white"
              }`}
            />
            <Editor
              id="cidade"
              label="Cidade"
              register={register("cidade")}
              error={errors.cidade?.message}
              ehCampoSenha={false}
              disabled={isEditing ? isReadOnly : true}
              placeholder="Sua Cidade"
              inputClassName={`h-12 w-full border p-2 rounded-md ${
                isReadOnly ? "bg-gray-100" : "bg-white"
              }`}
            />
            <Editor
              id="estado"
              label="Estado"
              register={register("estado")}
              error={errors.estado?.message}
              ehCampoSenha={false}
              disabled={isEditing ? isReadOnly : true}
              placeholder="Seu Estado"
              inputClassName={`h-12 w-full border p-2 rounded-md ${
                isReadOnly ? "bg-gray-100" : "bg-white"
              }`}
            />
            <Editor
              id="numeroResidencial"
              label="Número Residencial"
              register={register("numeroResidencial", { valueAsNumber: true })}
              error={errors.numeroResidencial?.message}
              ehCampoSenha={false}
              disabled={!isEditing}
              placeholder="Seu Número Residencial"
              inputClassName={`h-12 w-full border p-2 rounded-md ${
                !isEditing ? "bg-gray-100" : "bg-white"
              }`}
            />
          </div>
        </section>
      </div>

      {errors.root?.message && (
        <p className="text-sm text-red-600">{errors.root.message}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1F4D2C] text-white px-6 py-2 rounded hover:bg-green-900 transition"
        >
          {isEditing ? "Salvar" : "Editar"}
        </button>
      </div>
    </form>
  );
};

export default PerfilPage;
