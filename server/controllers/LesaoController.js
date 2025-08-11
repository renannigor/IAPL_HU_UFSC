import LesaoService from "../services/LesaoService.js";

class LesaoController {
  // Obtém dados necessários para preencher o formulário de cadastro/edição de lesão.
  static async getDadosFormulario(req, res) {
    try {
      const dadosFormulario = await LesaoService.getDadosFormulario();
      res.status(200).json(dadosFormulario);
    } catch (error) {
      console.error("Erro ao obter dados do formulário de lesão:", error);
      res
        .status(500)
        .json({ mensagem: "Erro ao obter dados do formulário de lesão." });
    }
  }

  // Cria uma nova lesão associada a um usuário e paciente.
  static async cadastrarLesao(req, res) {
    try {
      const dados = req.body;
      const { cpfUsuario, pacienteId } = req.params;

      await LesaoService.cadastrarLesao(cpfUsuario, pacienteId, dados);
      res.status(200).json({ mensagem: "Lesão cadastrada com sucesso!" });
    } catch (error) {
      console.error("Erro ao cadastrar uma lesão: ", error);
      res.status(500).json({ mensagem: "Erro ao cadastrar uma lesão." });
    }
  }

  // Atualiza uma lesão existente pelo usuário.
  static async atualizarLesao(req, res) {
    try {
      const dados = req.body;
      const { cpfUsuario, lesaoId } = req.params;

      await LesaoService.atualizarLesao(cpfUsuario, lesaoId, dados);
      res.status(200).json({ mensagem: "Lesão atualizada com sucesso!" });
    } catch (error) {
      console.error("Erro ao atualizar a lesão: ", error);
      res.status(500).json({ mensagem: "Erro ao atualizar a lesão." });
    }
  }

  // Deleta uma lesão pelo seu ID.
  static async deletarLesao(req, res) {
    try {
      const { lesaoId } = req.params;

      await LesaoService.deletarLesao(lesaoId);
      res.status(200).json({ mensagem: "Lesão deletada com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar a lesão: ", error);
      res.status(500).json({ mensagem: "Erro ao deletar a lesão." });
    }
  }

  // Obtém o histórico de uma lesão específica.
  static async getHistoricoLesao(req, res) {
    try {
      const { lesaoId } = req.params;

      const dadosHistorico = await LesaoService.getHistoricoLesao(lesaoId);
      res.status(200).json({
        mensagem: "Histórico recuperado com sucesso!",
        dados: dadosHistorico,
      });
    } catch (error) {
      console.error("Erro ao recuperar o histórico da lesão: ", error);
      res
        .status(500)
        .json({ mensagem: "Erro ao recuperar o histórico da lesão." });
    }
  }

  // Duplica uma lesão existente para um paciente.
  static async duplicarLesao(req, res) {
    try {
      const { cpfUsuario, pacienteId, lesaoOriginalId, lesaoBaseId } =
        req.params;

      await LesaoService.duplicarLesao(
        cpfUsuario,
        pacienteId,
        lesaoOriginalId,
        lesaoBaseId
      );
      res.status(200).json({ mensagem: "Lesão duplicada com sucesso!" });
    } catch (error) {
      console.error("Erro ao duplicar a lesão: ", error);
      res.status(500).json({ mensagem: "Erro ao duplicar a lesão." });
    }
  }

  // Obtém detalhes da lesão pelo ID, incluindo IDs relacionados.
  static async getLesaoPorId(req, res) {
    try {
      const { lesaoId } = req.params;

      const dadosLesao = await LesaoService.getLesaoPorId(lesaoId);
      res
        .status(200)
        .json({ mensagem: "Lesão recuperada com sucesso!", dados: dadosLesao });
    } catch (error) {
      console.error("Erro ao recuperar uma lesão: ", error);
      res.status(500).json({ mensagem: "Erro ao recuperar uma lesão." });
    }
  }

  // Obtém detalhes da lesão pelo ID, incluindo nomes relacionados.
  static async getLesaoPorNome(req, res) {
    try {
      const { lesaoId } = req.params;

      const dadosLesao = await LesaoService.getLesaoPorNome(lesaoId);
      res
        .status(200)
        .json({ mensagem: "Lesão recuperada com sucesso!", dados: dadosLesao });
    } catch (error) {
      console.error("Erro ao recuperar uma lesão: ", error);
      res.status(500).json({ mensagem: "Erro ao recuperar uma lesão." });
    }
  }

  // Lista todas as lesões de um paciente, com filtro de aprovação.
  static async getLesoesPorPaciente(req, res) {
    try {
      const { pacienteId } = req.params;
      const { precisaAprovacao } = req.query;

      const dadosLesao = await LesaoService.getLesoesPorPaciente(
        pacienteId,
        precisaAprovacao
      );
      res.status(200).json({
        mensagem: "Lesões recuperadas com sucesso!",
        dados: dadosLesao,
      });
    } catch (error) {
      console.error("Erro ao recuperar as lesões: ", error);
      res.status(500).json({ mensagem: "Erro ao recuperar as lesões." });
    }
  }

  // Obtém uma lesão específica
  static async getLesao(req, res) {
    try {
      const { lesaoId } = req.params;

      const dadosLesao = await LesaoService.getLesao(lesaoId);
      res.status(200).json({
        mensagem: "Lesão recuperada com sucesso!",
        dados: dadosLesao,
      });
    } catch (error) {
      console.error("Erro ao recuperar a lesão: ", error);
      res.status(500).json({ mensagem: "Erro ao recuperar a lesão." });
    }
  }

  // Atualiza o status de aprovação de uma lesão
  static async setAprovacao(req, res) {
    try {
      // Obtém os dados da requisição
      const { precisaAprovacao } = req.body;
      const { cpfUsuario, lesaoId } = req.params;

      console.log(precisaAprovacao);
      console.log(cpfUsuario, lesaoId);

      // Chama o serviço para atualizar a aprovação
      await LesaoService.setAprovacao(precisaAprovacao, lesaoId, cpfUsuario);

      // Retorna resposta de sucesso
      res.status(200).json({
        mensagem: "Status de aprovação da lesão atualizado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar status de aprovação da lesão:", error);
      res.status(500).json({
        mensagem: "Não foi possível atualizar o status de aprovação da lesão.",
      });
    }
  }
}

export default LesaoController;
