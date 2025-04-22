import { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import LabelInput from "../authentication/components/LabelInput";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import api from "../../api/api";

import { tiposUsuarios } from "../../schemas/registerSchema";

const ProfilePage = () => {
  const { usuarioAtual, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState(usuarioAtual?.nome || "");
  const [tipo, setTipo] = useState(usuarioAtual?.tipo || "");
  const [openDialog, setOpenDialog] = useState(false);

  const firstLetter = usuarioAtual?.nome?.charAt(0).toUpperCase() || "?";

  const handleButtonAction = () => {
    if (isEditing) {
      atualizarInfoPessoal(nome, tipo, usuarioAtual?.cpf!);
    }
    setIsEditing(!isEditing);
  };

  const atualizarInfoPessoal = async (
    nome: string,
    tipo: string,
    cpf: string
  ): Promise<void> => {
    try {
      await api.patch(`/api/usuarios/${cpf}/info-pessoal`, {
        nome: nome,
        tipo: tipo,
      });
    } catch (error) {
      console.error("Erro ao atualizar informações pessoais:", error);
    }
  };

  const excluirUsuario = async (cpf: string): Promise<void> => {
    try {
      await api.delete(`/api/usuarios/${cpf}`);
      logout();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
    }
  };

  return (
    <div className="space-y-8">
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
          onClick={handleButtonAction}
          className="bg-green-800 text-white px-6 py-2 rounded hover:bg-green-900 h-fit"
        >
          {isEditing ? "Salvar" : "Editar"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LabelInput
          id="nome"
          label="Nome Completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          disabled={!isEditing}
          inputClassName={`h-12 w-full border p-2 rounded-md ${
            !isEditing ? "bg-gray-100" : "bg-white"
          }`}
        />

        <LabelInput
          id="email"
          label="Email"
          value={usuarioAtual?.email}
          disabled
          inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
        />

        <div className="flex flex-col">
          <label className="block font-medium mb-1 text-sm">Sou:</label>
          <Select
            disabled={!isEditing}
            value={tipo}
            onValueChange={(value) => setTipo(value)}
          >
            <SelectTrigger
              className={`min-h-[48px] w-full border p-2 rounded-md ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
            >
              <SelectValue placeholder="Selecione um tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposUsuarios.map((tipo, index) => (
                <SelectItem key={index} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <LabelInput
          id="ultimo_acesso"
          label="Último Acesso"
          value={usuarioAtual?.ultimo_acesso}
          disabled
          inputClassName="h-12 w-full border p-2 rounded-md bg-gray-100"
        />
      </div>

      <div className="pt-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Mais Opções</h3>
        <button
          onClick={() => setOpenDialog(true)}
          className="px-6 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Excluir sua Conta
        </button>
      </div>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja excluir sua conta?</AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              Essa ação não poderá ser desfeita.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                excluirUsuario(usuarioAtual?.cpf!);
              }}
            >
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;
