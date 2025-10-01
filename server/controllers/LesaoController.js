import LesaoService from "../services/LesaoService.js";

class LesaoController {
  // Obtém os IDs dos campos condicionais (campos que o usuário deve preencher caso outra opção seja selecionada) para validação
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

  // Obter dados para preencher formulário de lesão
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

  // Cadastrar nova lesão para paciente pelo usuário
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

  // Atualiza uma lesão específica
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

  // Deletar lesão pelo ID
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

  // Obter histórico de uma lesão
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

  // Duplicar lesão baseada em outra
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

  // Obter lesão pelo ID com IDs relacionados
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

  // Obter lesão pelo ID com nomes relacionados
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

  // Obter lista de lesões de um paciente, filtrando por necessidade de aprovação
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

  // Obter lesão específica
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

  // Atualizar status de aprovação da lesão
  static async setAprovacao(req, res, next) {
    try {
      const { cpfUsuario, lesaoId } = req.params;

      await LesaoService.setAprovacao(lesaoId, cpfUsuario);

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
