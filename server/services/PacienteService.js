import PacienteModel from "../models/PacienteModel.js";

class PacienteService {
  static async getPacientes() {
    // Obter dados de todos os paciente
    const result = await PacienteModel.getPacientes();
    return result;
  }

  static async getPaciente(pac_codigo) {
    // Obter dados de um paciente
    const result = await PacienteModel.getPaciente(pac_codigo);
    return result;
  }

  static async atualizarPaciente(pac_codigo, dadosAtualizados) {
    // Atualizar dados de um paciente
    const result = await PacienteModel.updatePaciente(
      pac_codigo,
      dadosAtualizados
    );
    return result;
  }
}

export default PacienteService;
