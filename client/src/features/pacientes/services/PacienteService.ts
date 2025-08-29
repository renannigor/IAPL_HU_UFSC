import api from "@/api/api";
import { toast } from "sonner";

class PacienteService {
  // Método para buscar uma lista paginada de pacientes
  static async getPacientes(paginaAtual: number, pacientesPorPagina: number) {
    try {
      const response = await api.get("/api/pacientes/todos/teste", {
        params: {
          pagina: paginaAtual,
          limite: pacientesPorPagina,
        },
      });
      return response.data.dados; 
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao carregar pacientes";
      toast.error(mensagemErro);
      throw error;
    }
  }

  // Método para buscar os dados de um paciente específico pelo ID
  static async getPaciente(id: string) {
    try {
      const response = await api.get(`/api/pacientes/${id}/teste`);
      return response.data.dados;
    } catch (error: any) {
      const mensagemErro =
        error.response?.data?.mensagem || "Erro ao obter paciente";
      toast.error(mensagemErro);
      throw error;
    }
  }
}

export default PacienteService;
