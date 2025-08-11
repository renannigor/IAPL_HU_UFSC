import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
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

const PerfilPage = () => {
  const { usuarioAtual } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PerfilUsuarioFields>({
    resolver: zodResolver(PerfilUsuarioSchema),
    defaultValues: {
      nome: usuarioAtual?.nome || "",
      tipo: usuarioAtual?.tipo || "",
      email: usuarioAtual?.email || "",
      ultimo_acesso: usuarioAtual?.ultimo_acesso || "",
    },
  });
  
  const firstLetter = usuarioAtual?.nome?.charAt(0).toUpperCase() || "?";

  const onSubmit: SubmitHandler<PerfilUsuarioFields> = async (data) => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      // Atualizando o perfil do usuário
      await UsuarioService.atualizarPerfil(usuarioAtual?.cpf!, data);
      setIsEditing(false);
    } catch (error) {
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.error ||
          "Erro ao atualizar informações pessoais"
        : "Erro inesperado. Tente novamente.";

      setError("root", { message: errorMessage });
    }
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

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-2xl font-semibold text-green-800">
          {firstLetter}
        </div>
        <div>
          <p className="text-lg font-semibold">{usuarioAtual?.nome}</p>
          <p className="text-sm text-muted-foreground">{usuarioAtual?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Nome */}
        <Editor
          id="nome"
          label="Nome Completo"
          ehCampoSenha={false}
          register={register("nome")}
          error={errors.nome?.message}
          disabled={!isEditing}
          placeholder="Seu nome"
          inputClassName={`h-12 w-full border p-2 rounded-md ${
            !isEditing ? "bg-gray-100" : "bg-white"
          }`}
        />

        {/* Email sempre desabilitado */}
        <Editor
          id="email"
          label="Email"
          ehCampoSenha={false}
          register={register("email")}
          error={errors.email?.message}
          placeholder="Seu email"
          disabled
          inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
        />

        {/* Tipo de usuário */}
        <Editor
          id="tipo"
          label="Tipo de Usuário"
          ehCampoSenha={false}
          register={register("tipo")}
          error={errors.tipo?.message}
          placeholder="Tipo de usuário"
          disabled
          inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
        />

        {/* Último acesso desabilitado */}
        <Editor
          id="ultimo_acesso"
          label="Último Acesso"
          ehCampoSenha={false}
          register={register("ultimo_acesso")}
          error={errors.ultimo_acesso?.message}
          placeholder="Seu último acesso"
          disabled
          inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
        />
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
