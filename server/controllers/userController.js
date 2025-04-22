import Usuarios from "../models/UserModel.js";

class UserController {
  static async filtrarUsuarios(req, res) {
    try {
      const {
        orderBy = "nome",
        ordem = "asc",
        pagina = 1,
        cpfLogado,
      } = req.query;
      const offset = (pagina - 1) * 8;

      const usuarios = await Usuarios.ordenarComFiltro(
        orderBy,
        ordem,
        offset,
        cpfLogado
      );
      const total = await Usuarios.contarTotalUsuarios();

      res.json({ usuarios, total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar usuários" });
    }
  }

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

  static async atualizarInfoPessoal(req, res) {
    try {
      const { cpf } = req.params;
      const { nome, tipo } = req.body;

      await Usuarios.atualizarInfoPessoal(nome, tipo, cpf);
      res.status(200).json({ mensagem: "Informações atualizadas!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar informações pessoais!" });
    }
  }
}

export default UserController;
