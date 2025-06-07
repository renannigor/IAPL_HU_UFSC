import { Opcao } from "@/types/opcao";

export interface DadosFormulario {
  etiologias: Opcao[];
  classificacoesLesaoPressao: Opcao[];
  regioesPerilesionais: Opcao[];
  bordas: Opcao[];
  estruturasNobres: Opcao[];
  tecidos: Opcao[];
  quantificacoesDor: Opcao[];
  exsudatos: Opcao[];
  tiposExsudato: Opcao[];
  odores: Opcao[];
  limpezas: Opcao[];
  desbridamentos: Opcao[];
  protecoes: Opcao[];
  coberturas: Opcao[];
  tiposFechamentoCurativo: Opcao[];
}
