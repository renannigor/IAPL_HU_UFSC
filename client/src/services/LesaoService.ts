import api from "@/api/api";

class LesaoService {
  static async obterLesao(id: string) {
    try {
      const response = await api.get(`/api/lesoes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter lesão", error);
      throw error;
    }
  }

  static async cadastrarLesao(data: {}) {
    try {
      await api.post("/api/lesoes/cadastrar", data);
    } catch (error) {
      console.error("Erro ao cadastrar lesão", error);
      throw error;
    }
  }

  static async atualizarInfoLesao(id: string, data: {}) {
    try {
      await api.put(`/api/lesoes/${id}/atualizar-info`, data);
    } catch (error) {
      console.error("Erro ao editar lesão", error);
      throw error;
    }
  }
}

export default LesaoService;
