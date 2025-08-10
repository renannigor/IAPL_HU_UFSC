import api from "@/api/api";

import { DadosFormLesao } from "@/features/lesoes/types/DadosFormLesao";

class DadosFormLesaoService {
  // Método para obter os dados do formulário de lesões
  static async getDadosFormLesao() {
    try {
      const response = await api.get<DadosFormLesao>(`/api/lesoes/form/dados`);
      return response.data; // Retorna os dados obtidos da resposta
    } catch (error) {
      console.error("Erro ao obter dados do formulário de lesões", error);
      throw error;
    }
  }
}

export default DadosFormLesaoService;
