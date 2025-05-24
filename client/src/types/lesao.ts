export interface Lesao {
  id: number;
  id_paciente: string;
  criado_por: string;
  modificado_por: string;
  aprovado_por: string;
  cadastrado_por_academico: boolean;
  possui_dor: string;
  escala_dor: number;
  exsudato: number;
  tipo_exsudato: number;
  odor: number;
  comprimento: number;
  largura: number;
  profundidade: number;
  tecido_id: number;
  cobertura_utilizada_id: number;
  fechamento_curativo_id: number;
}

export interface DadosLesaoFormatado {
  etiologias: string[];
  classificacoesLesaoPressao: string[];
  regioesPerilesionais: string[];
  outraRegiaoPerilesional?: string | null;
  bordas: string[];
  tecido: {
    estruturasNobres: string[];
    outraEstruturaNobre?: string;
    epitelizado: number;
    granulacao: number;
    hipergranulacao: number;
    necroseSeca: number;
    necroseUmida: number;
    esfacelo: number;
  };
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
  coberturaUtilizada: Record<string, number>;
  fechamentoCurativo: Record<string, number>;
}
