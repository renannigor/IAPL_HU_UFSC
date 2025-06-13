import LesaoService from "../services/LesaoService.js";

class LesaoController {
  static async obterDadosFormLesao(req, res) {
    try {
      const dados = await LesaoService.listarDadosFormLesao();
      res.status(200).json(dados);
    } catch (error) {
      console.error("Erro ao obter dados do formulário de lesão:", error);
      res
        .status(500)
        .json({ mensagem: "Erro ao obter dados do formulário de lesão." });
    }
  }

  static async cadastrarLesao(req, res) {
    try {
      const dados = req.body;
      const { cpf_usuario, id_paciente } = req.params;

      console.log(dados);

      await LesaoService.cadastrarLesao(cpf_usuario, id_paciente, dados);
      res.status(200).json({ mensagem: "Lesão cadastrada com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar uma lesão: ", error);
      res.status(500).json({
        mensagem: "Erro ao cadastrar uma lesão.",
      });
    }
  }

  static async atualizarLesao(req, res) {
    try {
      const dados = req.body;
      const { cpf_usuario, id_lesao } = req.params;

      console.log(dados);

      await LesaoService.atualizarLesao(cpf_usuario, id_lesao, dados);
      res.status(200).json({ mensagem: "Lesão atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar a lesão: ", error);
      res.status(500).json({
        mensagem: "Erro ao atualizar a lesão.",
      });
    }
  }

  static async deletarLesao(req, res) {
    try {
      const { id_lesao } = req.params;

      await LesaoService.deletarLesao(id_lesao);
      res.status(200).json({ mensagem: "Lesão deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar a lesão: ", error);
      res.status(500).json({
        mensagem: "Erro ao atualizar a lesão.",
      });
    }
  }

  static async obterLesao(req, res) {
    try {
      const { id_lesao } = req.params;

      const dadosLesao = await LesaoService.obterLesao(id_lesao);
      res
        .status(200)
        .json({ mensagem: "Lesão recuperada com sucesso!", dados: dadosLesao });
    } catch (error) {
      console.error("Erro ao recuperar uma lesão: ", error);
      res.status(500).json({
        mensagem: "Erro ao recuperar uma lesão.",
      });
    }
  }

  static async obterTodasLesoesPacientes(req, res) {
    try {
      const { pacienteId, precisaAprovacao } = req.query;

      const dadosLesao = await LesaoService.obterTodasLesoesPacientes(
        pacienteId,
        precisaAprovacao
      );
      res.status(200).json({
        mensagem: "Lesões recuperadas com sucesso!",
        dados: dadosLesao,
      });
    } catch (error) {
      console.error("Erro ao recuperar as lesões: ", error);
      res.status(500).json({
        mensagem: "Erro ao recuperar as lesões.",
      });
    }
  }
}

export default LesaoController;
