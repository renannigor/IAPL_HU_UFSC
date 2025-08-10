import Usuarios from "../models/UsuarioModel.js";

class UsuarioController {
  static async deletarUsuario(req, res) {
    try {
      const { cpf } = req.params;
      await Usuarios.excluirUsuario(cpf);
      res.status(200).json({ mensagem: "Usuário excluído com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao excluir usuário" });
    }
  }

  static async atualizarPermissao(req, res) {
    try {
      const { cpf } = req.params;
      const { possui_acesso } = req.body;

      await Usuarios.atualizarPermissao(cpf, possui_acesso);
      res.status(200).json({ mensagem: "Permissão atualizada!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar permissão" });
    }
  }

  static async atualizarPerfil(req, res) {
    try {
      const { cpf } = req.params;
      const { nome } = req.body;

      await Usuarios.atualizarPerfil(nome, cpf);
      res.status(200).json({ mensagem: "Informações atualizadas!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar informações pessoais!" });
    }
  }

  static async getTiposUsuario(req, res) {
    try {
      const usuarios = await Usuarios.getTiposUsuario();
      console.log(usuarios);
      res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar os tipos de usuário" });
    }
  }

  static async verificaPermissaoAprovacao(req, res) {
    try {
      const { tipo } = req.params;

      const usuarios = await Usuarios.verificaPermissaoAprovacao(tipo);
      console.log(usuarios);
      res.status(200).json(usuarios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao buscar os tipos de usuário" });
    }
  }
}

export default UsuarioController;
