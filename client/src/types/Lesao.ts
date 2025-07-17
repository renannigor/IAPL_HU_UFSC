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
  etiologias: string[];
  classificacoesLesaoPressao?: string[];
  regioesPerilesionais: string[];
  regiaoPerilesionalOutro?: string | null;
  bordas: string[];
  tecidos: ItemComValor[];
  estruturasNobres: string[];
  estruturaNobreOutro?: string | null;
  presencaTunel: string;
  dor: string;
  nivelDor?: number;
  quantificacoesDor?: string[];
  exsudato: string;
  tipoExsudato: string;
  odor: string;
  tamanho: {
    comprimento: number;
    largura: number;
    profundidade: number;
  };
  limpezas: string[];
  limpezaOutro?: string | null;
  desbridamentos: string[];
  desbridamentoOutro?: string | null;
  protecoes: string[];
  protecaoOutro?: string | null;
  coberturas: ItemComValor[];
  tiposFechamentoCurativo: ItemComValor[];
}
