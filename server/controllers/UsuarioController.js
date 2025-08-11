import UsuarioService from "../services/UsuarioService.js";

class UsuarioController {
  // Deleta um usuário do sistema.
  static async deletarUsuario(req, res) {
    try {
      const { cpf } = req.params;
      await UsuarioService.deletarUsuario(cpf);
      res.status(200).json({ mensagem: "Usuário deletado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao deletar usuário" });
    }
  }

  // Atualiza as informações pessoais de um usuário (nesse caso, apenas o nome).
  static async atualizarPerfil(req, res) {
    try {
      const { cpf } = req.params;
      const { nome } = req.body;

      await UsuarioService.atualizarPerfil(nome, cpf);
      res.status(200).json({ mensagem: "Informações atualizadas!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar informações pessoais!" });
    }
  }

  // Lista todos os tipos de usuário disponíveis no sistema.
  static async getTiposUsuario(req, res) {
    try {
      const usuarios = await UsuarioService.getTiposUsuario();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar os tipos de usuário" });
    }
  }
}

export default UsuarioController;
