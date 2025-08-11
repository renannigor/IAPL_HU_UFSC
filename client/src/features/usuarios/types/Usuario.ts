export type Usuario = {
  id: number;
  email: string;
  cpf?: string;
  nome?: string;
  tipo: string;
  online?: boolean;
  senha?: string;
  criado_em?: string;
  ultimo_acesso?: string;
};
