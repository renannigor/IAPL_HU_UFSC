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
      quantificacoesDor: await DadosFormLesaoModel.getQuantificacoesDor(),
      exsudatos: await DadosFormLesaoModel.getExsudatos(),
      tiposExsudato: await DadosFormLesaoModel.getTiposExsudato(),
      odores: await DadosFormLesaoModel.getOdores(),
    };
  }

  static async cadastrarLesao(cpf_usuario, id_paciente, dados) {
    // Salva a lesão
    await LesaoModel.cadastrarLesao(cpf_usuario, id_paciente, dados);
  }

  static async atualizarLesao(cpf_usuario, id_paciente, dados) {
    // Atualizar a lesão
    await LesaoModel.cadastrarLesao(cpf_usuario, id_paciente, dados);
  }

  static async obterLesao(id_lesao) {
    // Obter a lesão
    const dadosLesao = await LesaoModel.obterLesao(id_lesao);
    return dadosLesao;
  }

  static async obterTodasLesoesPacientes(idPaciente, cadastradoPorAcademico) {
    // Obter todas as lesões do paciente
    const dadosLesao = await LesaoModel.obterTodasLesoesPacientes(
      idPaciente,
      cadastradoPorAcademico
    );
    return dadosLesao;
  }
}

export default LesaoService;
