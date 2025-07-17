import api from "@/api/api";

class PacienteService {
  static async carregarPacientes(paginaAtual: number) {
    try {
      const response = await api.get("/api/pacientes/todos/teste", {
        params: {
          pagina: paginaAtual,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar pacientes", error);
      throw error;
    }
  }

  static async obterPaciente(id: string) {
    try {
      const response = await api.get(`/api/pacientes/${id}/teste`);
      return response.data;
    } catch (error) {
      console.error("Erro ao obter paciente", error);
      throw error;
    }
  }
}

export default PacienteService;
