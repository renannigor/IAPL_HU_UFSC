import { ItemComValor } from "./ItemComValor";

export interface LesaoComIdFormData {
  id: string;
  bordas: number[];
  etiologias: number[];
  classificacoesLesaoPressao?: number[];
  classificacoesDor?: number[];
  regioesPerilesionais: number[];
  estruturasNobres: number[];
  limpezas: number[];
  desbridamentos: number[];
  protecoes: number[];
  limpezaOutro?: string | undefined;
  desbridamentoOutro?: string | undefined;
  protecaoOutro?: string | undefined;
  regiaoPerilesionalOutro?: string | undefined;
  estruturaNobreOutro?: string | undefined;
  presencaTunel: "sim" | "nao";
  dor: "sim" | "nao";
  escalaNumericaDor?: number;
  quantidadeExsudato: number;
  odor: number;
  tipoExsudato: number;
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
