export type Usuario = {
  id: number;
  email: string;
  cpf?: string;
  nome?: string;
  tipo: string;
  possui_acesso?: boolean;
  online?: boolean;
  senha?: string;
  criado_em?: string;
  ultimo_acesso?: string;
};
