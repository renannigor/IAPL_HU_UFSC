export interface Paciente {
  internacao: number;
  pac_codigo: number;
  nome: string;
  nascimento: string;
  cor: string;
  sexo: "M" | "F" | string;
  altura_consultada: number | null;
  peso_consultada: number | null;
  altura_controle: number | null;
  peso_controle: number | null;
  qrt_numero: string | null;
  lto_lto_id: string | null;
  criticidade_alergica: string | null;
  grau_certeza: string | null;
  medicamento: string | null;
  agente_causador: string | null;
  classificacao_alergica: string;
}
