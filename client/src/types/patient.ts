export interface Paciente {
  id: number;
  nome_completo: string;
  data_nascimento: string; // formato ISO: "YYYY-MM-DD"
  idade: number;
  sexo: "Masculino" | "Feminino" | string;
  quarto: string;
  unidade_internacao: string;
  data_internacao: string; // formato ISO
  data_avaliacao_gicpel: string; // formato ISO
  alergias: string;
  cor_pele: string;
  altura: number;
  peso: number;
  imc: number;
  motivo_internacao: string;
  comorbidades: string[];
  medicamentos_uso: string[];
}
