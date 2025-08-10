import api from "@/api/api";
import { toast } from "sonner";
import { LesaoComIdFormData } from "../types/LesaoComIdFormData";
import { LesaoComNomeFormData } from "../types/LesaoComNomeFormData";
import {
  parseLesaoComIdsFromApi,
  parseLesaoComNomesFromApi,
} from "../utils/ParseLesao";

class LesaoService {
  // Busca todas as lesões de um paciente, com opção de filtro por "precisaAprovacao"
  static async getLesoes(pacienteId: string, precisaAprovacao: boolean) {
    try {
      const response = await api.get(`/api/lesoes/`, {
        params: {
          pacienteId: pacienteId,
          precisaAprovacao: precisaAprovacao,
        },
      });
      return response.data.dados; // Retorna os dados da resposta
    } catch (error) {
      console.error("Erro ao obter as lesões", error);
      throw error; // Propaga o erro para quem chamar a função
    }
  }

  // Obtém o histórico de uma lesão pelo ID
  static async getHistoricoLesao(lesaoId: string) {
    try {
      const response = await api.get(`/api/lesoes/${lesaoId}/historico`);
      console.log(response);
      return response.data.dados;
    } catch (error) {
      console.error("Erro ao obter histórico da lesão", error);
      throw error;
    }
  }

  // Duplica uma lesão com base em outra
  static async duplicarLesao(
    cpfUsuario: string,
    pacienteId: string,
    lesaoOriginalId: string,
    lesaoBaseId: string
  ) {
    try {
      const response = await api.post(
        `/api/lesoes/duplicar/${cpfUsuario}/${pacienteId}/${lesaoOriginalId}/${lesaoBaseId}`
      );
      toast(response.data.mensagem); // Mostra notificação com a mensagem da API
    } catch (error) {
      console.error("Erro ao duplicar lesão", error);
      throw error;
    }
  }

  // Busca os dados de uma lesão em formato com IDs
  static async getLesaoComIds(
    lesaoId: string
  ): Promise<{ dados: LesaoComIdFormData }> {
    try {
      const response = await api.get(`/api/lesoes/${lesaoId}/ids`);
      return {
        dados: parseLesaoComIdsFromApi(response.data.dados), // Converte os dados brutos
      };
    } catch (error) {
      console.error("Erro ao obter lesão", error);
      throw error;
    }
  }

  // Busca os dados de uma lesão em formato com nomes
  static async getLesaoComNomes(
    lesaoId: string
  ): Promise<{ dados: LesaoComNomeFormData }> {
    try {
      const response = await api.get(`/api/lesoes/${lesaoId}/nomes`);
      return {
        dados: parseLesaoComNomesFromApi(response.data.dados),
      };
    } catch (error) {
      console.error("Erro ao obter lesão", error);
      throw error;
    }
  }

  // Cadastra uma nova lesão
  static async cadastrarLesao(
    cpfUsuario: string,
    pacienteId: string,
    dados: {}
  ) {
    try {
      const response = await api.post(
        `/api/lesoes/cadastrar/${cpfUsuario}/${pacienteId}`,
        dados
      );
      toast(response.data.mensagem); // Exibe mensagem de sucesso/erro
    } catch (error) {
      console.error("Erro ao cadastrar lesão", error);
      throw error;
    }
  }

  // Atualiza uma lesão existente
  static async atualizarLesao(cpfUsuario: string, lesaoId: string, dados: {}) {
    try {
      const response = await api.put(
        `/api/lesoes/atualizar/${cpfUsuario}/${lesaoId}`,
        dados
      );
      toast(response.data.mensagem);
    } catch (error) {
      console.error("Erro ao editar lesão", error);
      throw error;
    }
  }

  // Deleta uma lesão pelo ID
  static async deletarLesao(lesaoId: string) {
    try {
      const response = await api.delete(`/api/lesoes/deletar/${lesaoId}`);
      toast(response.data.mensagem);
    } catch (error) {
      console.error("Erro ao deletar lesão", error);
      throw error;
    }
  }

  // Aprovar uma lesão
  static async aprovarLesao(cpfUsuario: string, lesaoId: string) {
    try {
      const response = await api.put(
        `/api/lesoes/aprovar/${cpfUsuario}/${lesaoId}`
      );
      toast(response.data.mensagem);
    } catch (error) {
      console.error("Erro ao aprovar lesão", error);
      throw error;
    }
  }
}

export default LesaoService;
