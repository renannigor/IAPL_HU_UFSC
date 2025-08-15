import UsuarioModel from "../models/UsuarioModel.js";

class UsuarioService {
  // Obter lesão pelo ID com IDs relacionados
  static async deletarUsuario(cpf) {
    await UsuarioModel.deletarUsuario(cpf);
  }

  // Atualiza as informações pessoais de um usuário.
  static async atualizarPerfil(dados, cpf) {
    await UsuarioModel.atualizarPerfil(dados, cpf);
  }

  // Lista todos os tipos de usuário disponíveis no sistema.
  static async getTiposUsuario() {
    const tiposLesao = await UsuarioModel.getTiposUsuario();
    return tiposLesao;
  }

  // Obtém os dados de um paciente específico.
  static async getUsuario(cpf) {
    const usuario = await UsuarioModel.getPorCPF(cpf);
    return usuario;
  }
}

export default UsuarioService;
