export interface Lesao {
  id: number;
  paciente_id: string;
  nome_criador: string;
  nome_modificador: string;
  nome_aprovador: string;
  precisa_aprovacao: boolean;
  presenca_tunel: string;
  possui_dor: string;
  escala_dor: number;
  comprimento: number;
  largura: number;
  profundidade: number;
}

export interface ItemComValor {
  id: number;
  nome: string;
  valor: number;
}

export interface DadosLesaoFormatado {
  etiologias: number[];
  classificacoesLesaoPressao?: number[];
  regioesPerilesionais: number[];
  regiaoPerilesionalOutro?: string | null;
  bordas: number[];
  tecido: ItemComValor[];
  estruturasNobres: number[];
  estruturaNobreOutro?: string | null;
  presencaTunel: string;
  dor: string;
  nivelDor?: number;
  quantificacoesDor?: number[];
  exsudato: number;
  tipoExsudato: number;
  odor: number;
  tamanho: {
    comprimento: number;
    largura: number;
    profundidade: number;
  };
  limpezas: number[];
  limpezaOutro?: string | null;
  desbridamentos: number[];
  desbridamentoOutro?: string | null;
  protecoes: number[];
  protecaoOutro?: string | null;
  coberturas: ItemComValor[];
  tiposFechamentoCurativo: ItemComValor[];
}
