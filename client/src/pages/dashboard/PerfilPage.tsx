import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import Editor from "@/components/shared/Editor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PerfilUsuarioFields,
  PerfilUsuarioSchema,
} from "@/schemas/PerfilUsuarioSchema";
import { isAxiosError } from "axios";
import ConfirmDialog from "./components/ConfirmDialog";
import UsuarioService from "@/services/UsuarioService";
import { Opcao } from "@/types/Opcao";
import { BreadcrumbNav } from "@/pages/dashboard/components/BreadcrumbNav";
import { MessageCircleWarningIcon } from "lucide-react";

const PerfilPage = () => {
  const { usuarioAtual, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [tiposUsuario, setTiposUsuario] = useState<Opcao[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PerfilUsuarioFields>({
    resolver: zodResolver(PerfilUsuarioSchema),
    defaultValues: {
      nome: usuarioAtual?.nome || "",
      tipo: Number(usuarioAtual?.tipo_id),
      email: usuarioAtual?.email || "",
    },
  });

  const firstLetter = usuarioAtual?.nome?.charAt(0).toUpperCase() || "?";

  // Carregar tipos de usuários
  useEffect(() => {
    const fetchTiposUsuario = async () => {
      const dados = await UsuarioService.obterTiposUsuario();
      console.log(dados);
      setTiposUsuario(dados);
    };
    fetchTiposUsuario();
  }, []);

  const onSubmit: SubmitHandler<PerfilUsuarioFields> = async (data) => {
    if (!isEditing) {
      // Ativa a edição e interrompe o envio do formulário
      setIsEditing(true);
      return;
    }

    try {
      console.log("Enviando:", data);
      await UsuarioService.atualizarInfoPessoal(usuarioAtual?.cpf!, data);
      console.log("Enviado com sucesso");
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      const errorMessage = isAxiosError(error)
        ? error.response?.data?.error ||
          "Erro ao atualizar informações pessoais"
        : "Erro inesperado. Tente novamente.";

      setError("root", { message: errorMessage });
    }
  };

  const excluirUsuario = async (cpf: string): Promise<void> => {
    try {
      await UsuarioService.excluirUsuario(cpf);
      logout();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <BreadcrumbNav
          itens={[
            { titulo: "Home", href: "/" },
            { titulo: "Perfil", href: "/dashboard/perfil" },
          ]}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Meu Perfil</h2>
        <p className="text-muted-foreground">
          Visualize e edite suas informações pessoais.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-xl font-semibold text-green-800">
            {firstLetter}
          </div>
          <div>
            <p className="text-lg font-semibold">{usuarioAtual?.nome}</p>
            <p className="text-sm text-muted-foreground">
              {usuarioAtual?.email}
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#1F4D2C] text-white px-6 py-2 rounded hover:bg-green-900 h-fit"
        >
          {isEditing ? "Salvar" : "Editar"}
        </button>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações Pessoais</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="flex flex-col">
              <label className="block font-medium mb-1 text-sm">Sou:</label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select
                    disabled={!isEditing}
                    value={String(field.value ?? "")}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger
                      className={`min-h-[48px] w-full border p-2 rounded-md ${
                        isEditing ? "bg-white" : "bg-gray-100"
                      }`}
                    >
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposUsuario.map((tipo, index) => (
                        <SelectItem key={index} value={String(tipo.id)}>
                          {tipo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipo && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.tipo.message}
                </p>
              )}
            </div>

            <Editor
              id="ultimo_acesso"
              label="Último Acesso"
              value={usuarioAtual?.ultimo_acesso}
              ehCampoSenha={false}
              placeholder="Seu último acesso"
              disabled
              inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
            />
          </div>
        </TabsContent>

        <TabsContent value="config">
          <div className="pt-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Mais Opções</h3>
            <button
              type="button"
              onClick={() => setOpenDialog(true)}
              className="px-6 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Excluir sua Conta
            </button>
          </div>
        </TabsContent>
      </Tabs>

      {errors.root?.message && (
        <p className="text-sm text-red-600">{errors.root.message}</p>
      )}

      <ConfirmDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        title="Deseja excluir sua conta?"
        description="Essa ação não poderá ser desfeita."
        confirmLabel="Confirmar Exclusão"
        onConfirm={() => excluirUsuario(usuarioAtual?.cpf!)}
        confirmColor="danger"
        icon={<MessageCircleWarningIcon className="w-5 h-5 text-red-600" />}
      />
    </form>
  );
};

export default PerfilPage;
