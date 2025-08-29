import UsuarioService from "../services/UsuarioService.js";

class UsuarioController {
  // Deleta um usuário do sistema.
  static async deletarUsuario(req, res, next) {
    try {
      const { cpf } = req.params;
      await UsuarioService.deletarUsuario(cpf);
      res.status(200).json({
        sucesso: true,
        mensagem: "Usuário deletado com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }

  // Atualiza as informações pessoais de um usuário
  static async atualizarPerfil(req, res, next) {
    try {
      const { cpf } = req.params;
      const dados = req.body;

      await UsuarioService.atualizarPerfil(dados, cpf);
      res.status(200).json({
        sucesso: true,
        mensagem: "Informações do usuário atualizadas com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }

  // Lista todos os tipos de usuário disponíveis no sistema.
  static async getTiposUsuario(req, res, next) {
    try {
      const usuarios = await UsuarioService.getTiposUsuario();
      res.status(200).json({
        sucesso: true,
        mensagem: "Tipos de usuário recuperados com sucesso!",
        dados: usuarios,
      });
    } catch (error) {
      next(error);
    }
  }

  // Obtém os dados de um usuário específico
  static async getUsuario(req, res, next) {
    try {
      const { cpf } = req.params;
      const usuario = await UsuarioService.getUsuario(cpf);
      res.status(200).json({
        sucesso: true,
        mensagem: "Usuário recuperado com sucesso!",
        dados: usuario,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UsuarioController;
