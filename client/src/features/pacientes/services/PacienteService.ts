import api from "@/api/api";

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
      return response.data; // espera { total: number, pacientes: Paciente[] }
    } catch (error) {
      console.error("Erro ao carregar pacientes", error);
      throw error;
    }
  }

  // Método para buscar os dados de um paciente específico pelo ID
  static async getPaciente(id: string) {
    try {
      // Requisição GET para o endpoint "/api/pacientes/{id}/teste"
      const response = await api.get(`/api/pacientes/${id}/teste`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter paciente", error);
      throw error;
    }
  }
}

export default PacienteService;
