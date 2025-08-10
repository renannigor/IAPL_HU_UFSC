import { Opcao } from "@/types/Opcao";

export interface DadosFormLesao {
  etiologias: Opcao[];
  classificacoesLesaoPressao: Opcao[];
  regioesPerilesionais: Opcao[];
  bordas: Opcao[];
  estruturasNobres: Opcao[];
  tecidos: Opcao[];
  classificacoesDor: Opcao[];
  quantidadesExsudato: Opcao[];
  tiposExsudato: Opcao[];
  odores: Opcao[];
  limpezas: Opcao[];
  desbridamentos: Opcao[];
  protecoes: Opcao[];
  coberturas: Opcao[];
  tiposFechamentoCurativo: Opcao[];
}
