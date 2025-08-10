export interface Lesao {
  id: string;
  paciente_id: string;
  nome_criador: string;
  nome_modificador: string;
  nome_aprovador: string;
  precisa_aprovacao: boolean;
  presenca_tunel: string;
  possui_dor: string;
  escala_numerica_dor: number;
  comprimento: number;
  largura: number;
  profundidade: number;
  data_proxima_avaliacao: Date;
  data_criacao: Date;
  localizacao: string;
}
