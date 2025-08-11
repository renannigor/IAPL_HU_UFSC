import PacienteModel from "../models/PacienteModel.js";

class PacienteService {
  // Método para obter dados dos pacientes
  static async getPacientes(pagina, limite) {
    // Chama o model passando pagina e limite
    const resultado = await PacienteModel.getPacientes(pagina, limite);
    return resultado;
  }

  // Método para obter dados de um paciente específico
  static async getPaciente(pacienteCodigo) {
    const result = await PacienteModel.getPaciente(pacienteCodigo);
    return result;
  }
}

export default PacienteService;
