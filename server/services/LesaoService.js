import DadosFormLesaoModel from "../models/DadosFormLesaoModel.js";
import LesaoModel from "../models/LesaoModel.js";

class LesaoService {
  static async listarDadosFormLesao() {
    return {
      etiologias: await DadosFormLesaoModel.getEtiologias(),
      classificacoesLesaoPressao:
        await DadosFormLesaoModel.getClassificacoesLesaoPressao(),
      regioesPerilesionais: await DadosFormLesaoModel.getRegioesPerilesionais(),
      bordas: await DadosFormLesaoModel.getBordas(),
      estruturasNobres: await DadosFormLesaoModel.getEstruturasNobres(),
      tecidos: await DadosFormLesaoModel.getTecidos(),
      classificacoesDor: await DadosFormLesaoModel.getClassificacoesDor(),
      exsudatos: await DadosFormLesaoModel.getExsudatos(),
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

  static async cadastrarLesao(cpfUsuario, idPaciente, dados) {
    // Salva a lesão
    await LesaoModel.cadastrarLesao(cpfUsuario, idPaciente, dados);
  }

  static async atualizarLesao(cpfUsuario, idLesao, dados) {
    // Atualizar a lesão
    await LesaoModel.atualizarLesao(cpfUsuario, idLesao, dados);
  }

  static async deletarLesao(idLesao) {
    // Deletar a lesão
    await LesaoModel.deletarLesao(idLesao);
  }

  static async getLesaoComIds(idLesao) {
    // Obter a lesão
    const dadosLesao = await LesaoModel.getLesaoComIds(idLesao);
    return dadosLesao;
  }

  static async getLesaoComNomes(idLesao) {
    // Obter a lesão
    const dadosLesao = await LesaoModel.getLesaoComNomes(idLesao);
    return dadosLesao;
  }

  static async getLesoesPaciente(pacienteId, precisaAprovacao) {
    // Obter todas as lesões do paciente
    const dadosLesao = await LesaoModel.getLesoesPaciente(
      pacienteId,
      precisaAprovacao
    );
    return dadosLesao;
  }
}

export default LesaoService;
