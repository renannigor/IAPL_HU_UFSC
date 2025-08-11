import DadosFormLesaoModel from "../models/DadosFormLesaoModel.js";
import LesaoModel from "../models/LesaoModel.js";

class LesaoService {
  // Obter dados para preencher formulário de lesão
  static async getDadosFormulario() {
    return {
      etiologias: await DadosFormLesaoModel.getEtiologias(),
      classificacoesLesaoPressao:
        await DadosFormLesaoModel.getClassificacoesLesaoPressao(),
      regioesPerilesionais: await DadosFormLesaoModel.getRegioesPerilesionais(),
      bordas: await DadosFormLesaoModel.getBordas(),
      estruturasNobres: await DadosFormLesaoModel.getEstruturasNobres(),
      tecidos: await DadosFormLesaoModel.getTecidos(),
      classificacoesDor: await DadosFormLesaoModel.getClassificacoesDor(),
      quantidadesExsudato: await DadosFormLesaoModel.getQuantidadesExsudato(),
      tiposExsudato: await DadosFormLesaoModel.getTiposExsudato(),
      odores: await DadosFormLesaoModel.getOdores(),
      limpezas: await DadosFormLesaoModel.getLimpezas(),
      desbridamentos: await DadosFormLesaoModel.getDesbridamentos(),
      protecoes: await DadosFormLesaoModel.getProtecoes(),
      coberturas: await DadosFormLesaoModel.getCoberturas(),
      tiposFechamentoCurativo:
        await DadosFormLesaoModel.getTiposFechamentoCurativo(),
    };
  }

  // Cadastrar nova lesão para paciente pelo usuário
  static async cadastrarLesao(cpfUsuario, pacienteId, dadosLesao) {
    await LesaoModel.cadastrarLesao(cpfUsuario, pacienteId, dadosLesao);
  }

  // Atualizar lesão específica
  static async atualizarLesao(cpfUsuario, lesaoId, dadosAtualizados) {
    await LesaoModel.atualizarLesao(cpfUsuario, lesaoId, dadosAtualizados);
  }

  // Deletar lesão pelo ID
  static async deletarLesao(lesaoId) {
    await LesaoModel.deletarLesao(lesaoId);
  }

  // Obter histórico de uma lesão
  static async getHistoricoLesao(lesaoId) {
    const dadosHistoricoLesao = await LesaoModel.getHistoricoLesao(lesaoId);
    return dadosHistoricoLesao;
  }

  // Duplicar lesão baseada em outra
  static async duplicarLesao(
    cpfUsuario,
    pacienteId,
    lesaoOriginalId,
    lesaoBaseId
  ) {
    await LesaoModel.duplicarLesao(
      cpfUsuario,
      pacienteId,
      lesaoOriginalId,
      lesaoBaseId
    );
  }

  // Obter lesão pelo ID com IDs relacionados
  static async getLesaoPorId(lesaoId) {
    const dadosLesao = await LesaoModel.getLesaoPorId(lesaoId);
    return dadosLesao;
  }

  // Obter lesão pelo ID com nomes relacionados
  static async getLesaoPorNome(lesaoId) {
    const dadosLesao = await LesaoModel.getLesaoPorNome(lesaoId);
    return dadosLesao;
  }

  // Obter lista de lesões de um paciente, filtrando por necessidade de aprovação
  static async getLesoesPorPaciente(pacienteId, precisaAprovacao) {
    // Obter todas as lesões do paciente
    const dadosLesao = await LesaoModel.getLesoesPorPaciente(
      pacienteId,
      precisaAprovacao
    );
    return dadosLesao;
  }

  // Obter lesão específica
  static async getLesao(lesaoId) {
    const dadosLesao = await LesaoModel.getLesao(lesaoId);
    return dadosLesao;
  }

  // Atualizar status de aprovação da lesão
  static async setAprovacao(precisaAprovacao, lesaoId, cpfUsuario) {
    await LesaoModel.setAprovacao(precisaAprovacao, lesaoId, cpfUsuario);
  }
}

export default LesaoService;
