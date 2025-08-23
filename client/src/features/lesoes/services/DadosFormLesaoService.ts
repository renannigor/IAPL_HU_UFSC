import api from "@/api/api";
import { toast } from "sonner";

import { DadosFormLesao } from "@/features/lesoes/types/DadosFormLesao";
import { CamposCondicionaisFormulario } from "../types/CamposCondicionaisFormulario";

class DadosFormLesaoService {
  // Método para obter os dados do formulário de lesões
  static async getDadosFormLesao() {
    try {
      const response = await api.get<DadosFormLesao>(`/api/lesoes/formulario`);
      return response.data; // Retorna os dados obtidos da resposta
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem ||
        "Erro ao carregar dados do formulário de lesões";
      toast.error(mensagemErro);
      throw error; // Propaga o erro
    }
  }

  // Método para obter os IDs dos campos condicionais
  static async getIdsCamposCondicionais() {
    try {
      const response = await api.get<CamposCondicionaisFormulario>(
        `/api/lesoes/formulario/camposCondicionais`
      );
      return response.data; // Retorna os dados obtidos da resposta
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem ||
        "Erro ao carregar IDs dos campos condicionais";
      toast.error(mensagemErro);
      throw error; // Propaga o erro
    }
  }
}

export default DadosFormLesaoService;
