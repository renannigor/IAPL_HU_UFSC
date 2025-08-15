import api from "@/api/api";
import { Opcao } from "@/types/Opcao";

class UsuarioService {
  // Método  para obter os tipos de usuário do sistema
  static async getTiposUsuario() {
    try {
      const response = await api.get<Opcao[]>(`/api/usuarios/tipos`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao obter os tipos de usuário: ", error);
      throw error;
    }
  }

  // Método para atualizar as informações pessoais do usuário pelo CPF
  static async atualizarPerfil(cpf: string, data: {}) {
    try {
      await api.patch(`/api/usuarios/atualizar/${cpf}`, data, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erro ao atualizar informações pessoais: ", error);
      throw error;
    }
  }

  // Método para obter os dados de uma usuário específico
  static async getUsuario(cpf: string) {
    try {
      await api.get(`/api/usuarios/${cpf}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erro ao obter informações do usuário: ", error);
      throw error;
    }
  }
}

export default UsuarioService;
