import api from "@/api/api";
import { DadosFormulario } from "@/types/DadosFormulario";

class DadosFormService {
  static async obterDadosForm() {
    try {
      const response = await api.get<DadosFormulario>(`/api/lesoes/form/dados`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter dados do formulário de lesões", error);
      throw error;
    }
  }
}

export default DadosFormService;
