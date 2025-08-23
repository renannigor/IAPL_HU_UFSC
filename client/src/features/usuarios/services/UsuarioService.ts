import api from "@/api/api";
import { toast } from "sonner";
import { Opcao } from "@/types/Opcao";

class UsuarioService {
  // Método para obter os tipos de usuário do sistema
  static async getTiposUsuario() {
    try {
      const response = await api.get<Opcao[]>(`/api/usuarios/tipos`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao obter os tipos de usuário";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Método para atualizar as informações pessoais do usuário pelo CPF
  static async atualizarPerfil(cpf: string, data: {}) {
    try {
      const response = await api.patch(`/api/usuarios/atualizar/${cpf}`, data, {
        withCredentials: true,
      });
      toast.success(response.data.mensagem || "Perfil atualizado com sucesso");
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem ||
        "Erro ao atualizar informações pessoais";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Método para obter os dados de um usuário específico
  static async getUsuario(cpf: string) {
    try {
      const response = await api.get(`/api/usuarios/${cpf}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem ||
        "Erro ao obter informações do usuário";
      toast.error(mensagemErro);
      throw error;
    }
  }
}

export default UsuarioService;
