import { ItemComValor } from "../types/ItemComValor";
import { LesaoPorIdFormData } from "../types/LesaoPorIdFormData";
import { LesaoPorNomeFormData } from "../types/LesaoPorNomeFormData";

function parseTamanho(data: any) {
  return {
    comprimento: Number(data?.comprimento ?? 0),
    largura: Number(data?.largura ?? 0),
    profundidade: Number(data?.profundidade ?? 0),
  };
}

function parseItensComValor(data: any[]): ItemComValor[] {
  return (
    data?.map((item) => ({
      ...item,
      valor: Number(item.valor ?? 0),
    })) ?? []
  );
}

// 🧩 Função base para dados comuns
function parseCamposComuns(data: any) {
  return {
    id: data.id ?? undefined,
    bordas: data.bordas ?? [],
    etiologias: data.etiologias ?? [],
    classificacoesLesaoPressao: data.classificacoesLesaoPressao ?? [],
    classificacoesDor: data.classificacoesDor ?? [],
    regioesPerilesionais: data.regioesPerilesionais ?? [],
    estruturasNobres: data.estruturasNobres ?? [],
    limpezas: data.limpezas ?? [],
    desbridamentos: data.desbridamentos ?? [],
    protecoes: data.protecoes ?? [],
    limpezaOutro: data.limpezaOutro ?? undefined,
    desbridamentoOutro: data.desbridamentoOutro ?? undefined,
    protecaoOutro: data.protecaoOutro ?? undefined,
    regiaoPerilesionalOutro: data.regiaoPerilesionalOutro ?? undefined,
    estruturaNobreOutro: data.estruturaNobreOutro ?? undefined,
    presencaTunel: data.presencaTunel,
    dor: data.dor,
    escalaNumericaDor: data.escalaNumericaDor
      ? Number(data.escalaNumericaDor)
      : undefined,
    dataProximaAvaliacao: new Date(data.dataProximaAvaliacao),
    localizacaoLesao: data.localizacaoLesao ?? undefined,
    tamanho: parseTamanho(data.tamanho),
    tecidos: parseItensComValor(data.tecidos),
    coberturas: parseItensComValor(data.coberturas),
    tiposFechamentoCurativo: parseItensComValor(data.tiposFechamentoCurativo),
  };
}

export function parseLesaoComIdsFromApi(data: any): LesaoPorIdFormData {
  return {
    ...parseCamposComuns(data),
    quantidadeExsudato: Number(data.quantidadeExsudato),
    odor: Number(data.odor),
    tipoExsudato: Number(data.tipoExsudato),
  };
}

export function parseLesaoComNomesFromApi(data: any): LesaoPorNomeFormData {
  return {
    ...parseCamposComuns(data),
    quantidadeExsudato: data.quantidadeExsudato,
    odor: data.odor,
    tipoExsudato: data.tipoExsudato,
  };
}
