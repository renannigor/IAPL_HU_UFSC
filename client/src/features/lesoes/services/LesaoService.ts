import api from "@/api/api";
import { toast } from "sonner";
import {
  parseLesaoComIdsFromApi,
  parseLesaoComNomesFromApi,
} from "../utils/ParseLesao";
import { LesaoPorIdFormData } from "../types/LesaoPorIdFormData";
import { LesaoPorNomeFormData } from "../types/LesaoPorNomeFormData";

class LesaoService {
  // Busca todas as lesões de um paciente, com opção de filtro por "precisaAprovacao"
  static async getLesoes(pacienteId: string, precisaAprovacao: boolean) {
    try {
      const response = await api.get(`/api/lesoes/paciente/${pacienteId}`, {
        params: { precisaAprovacao },
      });
      return response.data.dados; // Retorna os dados da resposta
    } catch (error: any) {
      console.error("Erro ao obter as lesões", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao obter as lesões";
      toast.error(mensagemErro);
      throw error; // Propaga o erro para quem chamar a função
    }
  }

  // Buscar uma lesão específica
  static async getLesao(lesaoId: string) {
    try {
      const response = await api.get(`/api/lesoes/${lesaoId}`);
      return response.data.dados; // Retorna os dados da resposta
    } catch (error: any) {
      console.error("Erro ao obter a lesão", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao obter a lesão";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Obtém o histórico de uma lesão pelo ID
  static async getHistoricoLesao(lesaoId: string) {
    try {
      const response = await api.get(`/api/lesoes/${lesaoId}/historico`);
      return response.data.dados;
    } catch (error: any) {
      console.error("Erro ao obter histórico da lesão", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao obter histórico da lesão";
      toast.error(mensagemErro);
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
        `/api/lesoes/usuario/${cpfUsuario}/paciente/${pacienteId}/lesao/${lesaoOriginalId}/duplicar/${lesaoBaseId}`
      );
      toast.success(response.data.mensagem); // Mensagem de sucesso
    } catch (error: any) {
      console.error("Erro ao duplicar lesão", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao duplicar lesão";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Busca os dados de uma lesão em formato com IDs
  static async getLesaoPorId(
    lesaoId: string
  ): Promise<{ dados: LesaoPorIdFormData }> {
    try {
      const response = await api.get(`/api/lesoes/${lesaoId}/ids`);
      return { dados: parseLesaoComIdsFromApi(response.data.dados) }; // Converte os dados brutos
    } catch (error: any) {
      console.error("Erro ao obter lesão por ID", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao obter lesão";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Busca os dados de uma lesão em formato com nomes
  static async getLesaoPorNome(
    lesaoId: string
  ): Promise<{ dados: LesaoPorNomeFormData }> {
    try {
      const response = await api.get(`/api/lesoes/${lesaoId}/nomes`);
      return { dados: parseLesaoComNomesFromApi(response.data.dados) };
    } catch (error: any) {
      console.error("Erro ao obter lesão por nome", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao obter lesão";
      toast.error(mensagemErro);
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
        `/api/lesoes/usuario/${cpfUsuario}/paciente/${pacienteId}`,
        dados
      );
      toast.success(response.data.mensagem); // Mensagem de sucesso
    } catch (error: any) {
      console.error("Erro ao cadastrar lesão", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao cadastrar lesão";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Atualiza uma lesão existente
  static async atualizarLesao(cpfUsuario: string, lesaoId: string, dados: {}) {
    try {
      const response = await api.put(
        `/api/lesoes/usuario/${cpfUsuario}/lesao/${lesaoId}`,
        dados
      );
      toast.success(response.data.mensagem); // Mensagem de sucesso
    } catch (error: any) {
      console.error("Erro ao editar lesão", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao atualizar lesão";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Deleta uma lesão pelo ID
  static async deletarLesao(lesaoId: string) {
    try {
      const response = await api.delete(`/api/lesoes/${lesaoId}`);
      toast.success(response.data.mensagem); // Mensagem de sucesso
    } catch (error: any) {
      console.error("Erro ao deletar lesão", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao deletar lesão";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Aprovar uma lesão
  static async setAprovacao(cpfUsuario: string, lesaoId: string) {
    try {
      const response = await api.patch(
        `/api/lesoes/usuario/${cpfUsuario}/lesao/${lesaoId}/aprovacao`
      );
      toast.success(response.data.mensagem); // Mensagem de sucesso
    } catch (error: any) {
      console.error("Erro ao aprovar lesão", error);
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao aprovar lesão";
      toast.error(mensagemErro);
      throw error;
    }
  }
}

export default LesaoService;
