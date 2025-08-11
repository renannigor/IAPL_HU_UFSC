import UsuarioModel from "../models/UsuarioModel.js";

class UsuarioService {
  // Obter lesão pelo ID com IDs relacionados
  static async deletarUsuario(cpf) {
    await UsuarioModel.deletarUsuario(cpf);
  }

  // Atualiza as informações pessoais de um usuário (nesse caso, apenas o nome).
  static async atualizarPerfil(nome, cpf) {
    await UsuarioModel.atualizarPerfil(nome, cpf);
  }

  // Lista todos os tipos de usuário disponíveis no sistema.
  static async getTiposUsuario() {
    const tiposLesao = await UsuarioModel.getTiposUsuario();
    return tiposLesao;
  }
}

export default UsuarioService;
