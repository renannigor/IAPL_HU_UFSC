import api from "@/api/api";
import { Opcao } from "@/types/Opcao";

class UsuarioService {
  static async obterTiposUsuario() {
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

  static async atualizarInfoPessoal(cpf: string, data: {}) {
    try {
      await api.patch(`/api/usuarios/atualizar/${cpf}/info-pessoal`, data, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erro ao atualizar informações pessoais: ", error);
      throw error;
    }
  }

  static async excluirUsuario(cpf: string) {
    try {
      await api.delete(`/api/usuarios/deletar/${cpf}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erro ao excluir usuário: ", error);
      throw error;
    }
  }
}

export default UsuarioService;
