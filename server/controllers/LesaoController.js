import LesaoService from "../services/LesaoService.js";

class LesaoController {
  static async getIdsCamposCondicionais(req, res, next) {
    try {
      const ids = await LesaoService.getIdsCamposCondicionais();
      return res.status(200).json({
        sucesso: true,
        mensagem: "IDs de campos condicionais recuperados com sucesso!",
        dados: ids,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getDadosFormulario(req, res, next) {
    try {
      const dadosFormulario = await LesaoService.getDadosFormulario();
      res.status(200).json({
        sucesso: true,
        mensagem: "Dados do formulário recuperados com sucesso!",
        dados: dadosFormulario,
      });
    } catch (error) {
      next(error);
    }
  }

  static async cadastrarLesao(req, res, next) {
    try {
      const dados = req.body;
      const { cpfUsuario, pacienteId } = req.params;

      await LesaoService.cadastrarLesao(cpfUsuario, pacienteId, dados);
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesão cadastrada com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async atualizarLesao(req, res, next) {
    try {
      const dados = req.body;
      const { cpfUsuario, lesaoId } = req.params;

      await LesaoService.atualizarLesao(cpfUsuario, lesaoId, dados);
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesão atualizada com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletarLesao(req, res, next) {
    try {
      const { lesaoId } = req.params;
      await LesaoService.deletarLesao(lesaoId);
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesão deletada com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getHistoricoLesao(req, res, next) {
    try {
      const { lesaoId } = req.params;
      const dadosHistorico = await LesaoService.getHistoricoLesao(lesaoId);
      res.status(200).json({
        sucesso: true,
        mensagem: "Histórico recuperado com sucesso!",
        dados: dadosHistorico,
      });
    } catch (error) {
      next(error);
    }
  }

  static async duplicarLesao(req, res, next) {
    try {
      const { cpfUsuario, pacienteId, lesaoOriginalId, lesaoBaseId } =
        req.params;

      await LesaoService.duplicarLesao(
        cpfUsuario,
        pacienteId,
        lesaoOriginalId,
        lesaoBaseId
      );
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesão duplicada com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLesaoPorId(req, res, next) {
    try {
      const { lesaoId } = req.params;
      const dadosLesao = await LesaoService.getLesaoPorId(lesaoId);
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesão recuperada com sucesso!",
        dados: dadosLesao,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLesaoPorNome(req, res, next) {
    try {
      const { lesaoId } = req.params;
      const dadosLesao = await LesaoService.getLesaoPorNome(lesaoId);
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesão recuperada com sucesso!",
        dados: dadosLesao,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLesoesPorPaciente(req, res, next) {
    try {
      const { pacienteId } = req.params;
      const { precisaAprovacao } = req.query;

      const dadosLesao = await LesaoService.getLesoesPorPaciente(
        pacienteId,
        precisaAprovacao
      );
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesões recuperadas com sucesso!",
        dados: dadosLesao,
      });
    } catch (error) {
      next(error);
    }
  }

  // Buscar uma lesão específica
  static async getLesao(req, res, next) {
    try {
      const { lesaoId } = req.params;
      const dadosLesao = await LesaoService.getLesao(lesaoId);
      res.status(200).json({
        sucesso: true,
        mensagem: "Lesão recuperada com sucesso!",
        dados: dadosLesao,
      });
    } catch (error) {
      next(error);
    }
  }

  static async setAprovacao(req, res, next) {
    try {
      const { precisaAprovacao } = req.body;
      const { cpfUsuario, lesaoId } = req.params;

      await LesaoService.setAprovacao(precisaAprovacao, lesaoId, cpfUsuario);

      res.status(200).json({
        sucesso: true,
        mensagem: "Status de aprovação da lesão atualizado com sucesso!",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LesaoController;
