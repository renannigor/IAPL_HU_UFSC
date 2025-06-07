import api from "@/api/api";

class LesaoService {
  static async obterTodasLesoes(
    idPaciente: string,
    cadastradoPorAcademico: boolean
  ) {
    try {
      const response = await api.get(`/api/lesoes/obter`, {
        params: {
          idPaciente: idPaciente,
          cadastradoPorAcademico: cadastradoPorAcademico,
        },
      });
      return response.data.dados;
    } catch (error) {
      console.error("Erro ao obter lesão", error);
      throw error;
    }
  }

  static async obterLesao(id: string) {
    try {
      const response = await api.get(`/api/lesoes/obter/${id}`);
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
      await api.post(
        `/api/lesoes/cadastrar/${cpf_usuario}/${id_paciente}`,
        dados
      );
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
      await api.put(`/api/lesoes/atualizar/${cpf_usuario}/${id_lesao}`, dados);
    } catch (error) {
      console.error("Erro ao editar lesão", error);
      throw error;
    }
  }

  static async deletarLesao(id_lesao: string) {
    try {
      await api.put(`/api/lesoes/deletar/${id_lesao}`);
    } catch (error) {
      console.error("Erro ao deletar lesão", error);
      throw error;
    }
  }
}

export default LesaoService;
