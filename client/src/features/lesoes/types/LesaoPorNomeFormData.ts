import { ItemComValor } from "./ItemComValor";

export interface LesaoPorNomeFormData {
  id: string;
  bordas: string[];
  etiologias: string[];
  classificacoesLesaoPressao?: string[];
  classificacoesDor?: string[];
  regioesPerilesionais: string[];
  estruturasNobres: string[];
  limpezas: string[];
  desbridamentos: string[];
  protecoes: string[];
  limpezaOutro?: string | undefined;
  desbridamentoOutro?: string | undefined;
  protecaoOutro?: string | undefined;
  regiaoPerilesionalOutro?: string | undefined;
  estruturaNobreOutro?: string | undefined;
  presencaTunel: "sim" | "nao";
  dor: "sim" | "nao";
  escalaNumericaDor?: number;
  quantidadeExsudato: string;
  odor: string;
  tipoExsudato: string;
  tamanho: {
    comprimento: number;
    largura: number;
    profundidade: number;
  };
  tecidos: ItemComValor[];
  coberturas: ItemComValor[];
  tiposFechamentoCurativo: ItemComValor[];
  dataProximaAvaliacao: Date;
  localizacaoLesao: string;
}
