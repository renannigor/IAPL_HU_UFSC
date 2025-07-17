import api from "@/api/api";
import { toast } from "sonner";

class LesaoService {
  static async obterTodasLesoes(pacienteId: string, precisaAprovacao: boolean) {
    try {
      const response = await api.get(`/api/lesoes/obter`, {
        params: {
          pacienteId: pacienteId,
          precisaAprovacao: precisaAprovacao,
        },
      });
      return response.data.dados;
    } catch (error) {
      console.error("Erro ao obter lesão", error);
      throw error;
    }
  }

  static async getLesaoComIds(id: string) {
    try {
      const response = await api.get(`/api/lesoes/obter/${id}/ids`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter lesão", error);
      throw error;
    }
  }

  static async getLesaoComNomes(id: string) {
    try {
      const response = await api.get(`/api/lesoes/obter/${id}/nomes`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter lesão", error);
      throw error;
    }
  }

  static async cadastrarLesao(
    cpf_usuario: string,
    id_paciente: string,
    dados: {}
  ) {
    try {
      const response = await api.post(
        `/api/lesoes/cadastrar/${cpf_usuario}/${id_paciente}`,
        dados
      );
      toast(response.data.mensagem);
    } catch (error) {
      console.error("Erro ao cadastrar lesão", error);
      throw error;
    }
  }

  static async atualizarLesao(
    cpf_usuario: string,
    id_lesao: string,
    dados: {}
  ) {
    try {
      const response = await api.put(
        `/api/lesoes/atualizar/${cpf_usuario}/${id_lesao}`,
        dados
      );
      toast(response.data.mensagem);
    } catch (error) {
      console.error("Erro ao editar lesão", error);
      throw error;
    }
  }

  static async deletarLesao(id_lesao: number) {
    try {
      const response = await api.delete(`/api/lesoes/deletar/${id_lesao}`);
      toast(response.data.mensagem);
    } catch (error) {
      console.error("Erro ao deletar lesão", error);
      throw error;
    }
  }
}

export default LesaoService;
