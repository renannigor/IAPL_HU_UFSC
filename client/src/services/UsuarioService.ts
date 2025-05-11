import api from "@/api/api";

class UsuarioService {
  static async atualizarInfoPessoal(cpf: string, data: {}) {
    try {
      await api.patch(`/api/usuarios/${cpf}/info-pessoal`, data, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erro ao atualizar informações pessoais: ", error);
      throw error;
    }
  }

  static async excluirUsuario(cpf: string) {
    try {
      await api.delete(`/api/usuarios/${cpf}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Erro ao excluir usuário: ", error);
      throw error;
    }
  }
}

export default UsuarioService;
